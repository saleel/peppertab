// @ts-check

import React from 'react';
import UilPen from '@iconscout/react-unicons/icons/uil-pen';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import { isBrowserExtension, SettingKeys } from '../../constants';
import { getLinkFromUrl } from '../../model/utils';
import useSettings from '../../hooks/use-settings';
import { addTopSitesPermission } from '../../browser-permissions';
import FormModal from '../form-modal';
import './links.scss';


function Links() {
  const { linkStore, generalStore } = React.useContext(StoreContext);

  const topSitesCount = 8;

  const [linkToEdit, setLinkToEdit] = React.useState();

  const [isTopSitesEnabled, setIsTopSitesEnabled] = useSettings(SettingKeys.isTopSitesEnabled, false);
  const [showTopSites, setShowTopSite] = useSettings(SettingKeys.showTopSites, false);

  const [myLinks, { reFetch }] = usePromise(
    () => linkStore.findLinks(),
    {
      cacheKey: 'links',
      cachePeriodInSecs: 24 * 60 * 60,
      conditions: [!showTopSites],
    },
  );

  const [topSites] = usePromise(
    () => generalStore.findTopSites({ limit: topSitesCount }),
    {
      conditions: [isTopSitesEnabled, showTopSites],
      cacheKey: 'topSites',
      cachePeriodInSecs: 24 * 60 * 60,
    },
  );


  React.useEffect(() => {
    const unbind = linkStore.on('sync', () => { reFetch(); });

    return () => { unbind(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const links = showTopSites ? topSites : myLinks;


  async function onCreateClick() {
    setLinkToEdit({
      id: 'new',
      url: 'https://',
    });
  }


  async function onUpdate(id, data) {
    try {
      // eslint-disable-next-line no-new
      new URL(data.url);
    } catch (e) {
      throw new Error('Invalid URL. A Valid URL start with http or https');
    }

    if (id === 'new') {
      if (links.find((l) => l.url === data.url)) {
        throw new Error('This link already exist');
      }

      const link = await getLinkFromUrl(data.url);
      await linkStore.createLink({ ...link, siteName: data.siteName });
    } else {
      await linkStore.updateLink(id, data);
    }

    await reFetch();

    return true;
  }


  async function onDeleteClick(linkId) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this link?')) {
      await linkStore.deleteLink(linkId);
      reFetch();
    }
  }


  async function onShowTopSitesClick() {
    if (!isTopSitesEnabled) {
      await addTopSitesPermission();
      setIsTopSitesEnabled(true);
    }

    setShowTopSite(true);
  }


  async function onShowCustomSitesClick() {
    setShowTopSite(false);
  }


  function renderImage(link) {
    const { hostname, siteName, logoBase64 } = link;

    if (!hostname || !siteName) {
      return null;
    }

    return (
      <div className="links__item-image">
        {logoBase64 ? (
          <img alt="" src={logoBase64} />
        ) : (
          <div className="links__item-image-alphabet">{siteName[0]}</div>
        )}
      </div>
    );
  }


  return (
    <div className="links fade-in">

      <div className="links__items flex content-start flex-wrap ">

        {(links || []).map((link) => (
          <a key={link.id} title={link.siteName} href={link.url} className="links__item">
            {renderImage(link)}

            <div className="links__item-name">
              {link.siteName}
            </div>

            {link.id && (
              <button
                className="links__item-edit"
                type="button"
                onClick={(e) => {
                  // e.stopPropagation();
                  e.preventDefault();
                  e.nativeEvent.stopImmediatePropagation();
                  setLinkToEdit(link);
                }}
              >
                <UilPen size="12" />
              </button>
            )}

          </a>
        ))}

        {!showTopSites && (
          <button type="button" className="links__create" onClick={onCreateClick}>
            Add Link
          </button>
        )}
      </div>

      <div className="links__switch">
        {isBrowserExtension && !showTopSites && (
          <button type="button" onClick={onShowTopSitesClick}>
            Show most visited sites
          </button>
        )}

        {showTopSites && (
          <button type="button" onClick={onShowCustomSitesClick}>
            Show my links
          </button>
        )}
      </div>

      {linkToEdit && (
        <FormModal
          title="Edit Link"
          isOpen={!!linkToEdit}
          properties={{
            siteName: { type: 'String', title: 'Title', maxLength: 25 },
            url: { type: 'String', title: 'URL', maxLength: 1000 },
          }}
          values={linkToEdit}
          onSubmit={async (v) => {
            await onUpdate(linkToEdit.id, v);
            setLinkToEdit(undefined);
          }}
          onDelete={async () => {
            await onDeleteClick(linkToEdit.id);
            setLinkToEdit(undefined);
          }}
          onClose={() => { setLinkToEdit(undefined); }}
        />
      )}

    </div>
  );
}


export default React.memo(Links);
