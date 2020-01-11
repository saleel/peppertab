// @ts-check

import React from 'react';
import TrashIcon from '@iconscout/react-unicons/icons/uil-trash';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import { isBrowserExtension, SettingKeys } from '../../constants';
import { getLinkFromUrl } from '../../model/utils';
import useSettings from '../../hooks/use-settings';
import { addTopSitesPermission } from '../../browser-permissions';
import './links.scss';


function Links() {
  const { linkStore, lastSyncTime, generalStore } = React.useContext(StoreContext);

  const componentRenderedAt = React.useRef(new Date());

  const topSitesCount = 8;

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

  const links = showTopSites ? topSites : myLinks;


  React.useEffect(() => {
    if (showTopSites) {
      return;
    }

    if (new Date(lastSyncTime).getTime() > componentRenderedAt.current.getTime()) {
      reFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTopSites, lastSyncTime]);


  async function onCreateClick() {
    // eslint-disable-next-line no-alert
    const url = window.prompt('Enter the URL of website you want to add', 'https://');

    if (!url) return;

    try {
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (e) {
      // eslint-disable-next-line no-alert
      window.alert('Invalid URL');
      return;
    }

    if (links.find((l) => l.url === url)) {
      window.alert('URL already exist');
      return;
    }

    const link = await getLinkFromUrl(url);
    await linkStore.createLink(link);

    reFetch();
  }


  async function onDeleteClick(e, link) {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to delete this link?')) {
      e.preventDefault();
      e.stopPropagation();

      await linkStore.deleteLink(link.id);
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
          <a key={link.url} title={link.siteName} href={link.url} className="links__item">
            {renderImage(link)}

            <div className="links__item-name">
              {link.siteName}
            </div>

            {link.id && (
              <button type="button" className="links__item-delete" onClick={(e) => onDeleteClick(e, link)}>
                <TrashIcon size="13" />
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

    </div>
  );
}


export default Links;
