// @ts-check

import React from 'react';
import TrashIcon from '@iconscout/react-unicons/icons/uil-trash';
import usePromise from '../../hooks/use-promise';
import StoreContext from '../../contexts/store-context';
import { isBrowserExtension } from '../../constants';
import { getLinkFromUrl } from '../../model/utils';
import './links.scss';


function Links() {
  const { linkStore, lastSyncTime, generalStore } = React.useContext(StoreContext);

  const componentRenderedAt = React.useRef(new Date());
  const containerRef = React.useRef(null);

  const numLinks = Math.round((containerRef.current || {}).offsetWidth / 115); // 100 width + 15 margin

  const [links, { reFetch }] = usePromise(
    () => {
      if (generalStore.isTopSitesEnabled()) {
        return generalStore.findTopSites({ limit: numLinks });
      }
      return linkStore.findLinks({ limit: numLinks });
    },
    { defaultValue: [], dependencies: [numLinks] },
  );

  const showAdd = numLinks > links.length;


  React.useEffect(() => {
    if (new Date(lastSyncTime).getTime() > componentRenderedAt.current.getTime()) {
      reFetch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSyncTime]);


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

    const link = getLinkFromUrl(url);
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
    await generalStore.findTopSites({ limit: numLinks });
    reFetch();
  }


  async function onShowCustomSitesClick() {
    generalStore.setTopSitesEnabled(false);
    reFetch();
  }


  function renderImage(link) {
    const { hostname, siteName } = link;

    if (!hostname || !siteName) {
      return null;
    }

    const logoUrl = `https://logo.clearbit.com/${hostname}`;

    return (
      <div className="links__item-image">
        <img
          alt=""
          src={logoUrl}
          onError={function onError(e) {
            delete e.target.onerror;
            delete e.target.onError;

            e.target.className = 'links__item-image not-found';
          }}
        />
        <div className="links__item-image-alphabet">{siteName[0]}</div>
      </div>
    );
  }


  return (
    <div className="links" ref={containerRef}>

      <div className="links__items">
        {links.map((link) => (
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

        {showAdd && (
          <button type="button" className="links__create" onClick={onCreateClick}>
            Add Link
          </button>
        )}
      </div>

      <div className="links__switch">
        {isBrowserExtension && !generalStore.isTopSitesEnabled() && (
          <button type="button" onClick={onShowTopSitesClick}>
            Show Top Sites
          </button>
        )}

        {generalStore.isTopSitesEnabled() && (
          <button type="button" onClick={onShowCustomSitesClick}>
            Use Custom Links
          </button>
        )}
      </div>

    </div>
  );
}


export default Links;
