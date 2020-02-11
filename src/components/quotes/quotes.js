import React from 'react';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import { CacheKeys } from '../../constants';
import './quotes.scss';


function Quotes() {
  const { generalStore } = React.useContext(StoreContext);

  const [quote] = usePromise(() => generalStore.getQuote(), {
    cacheKey: CacheKeys.quote,
    cachePeriodInSecs: (24 * 60 * 60),
  });

  if (!quote) return null;


  return (
    <div className="quotes fade-in">
      {quote.message}
      {quote.author && (
        <span className="quotes__author">
          {' - '}
          {quote.author}
        </span>
      )}
    </div>
  );
}


export default React.memo(Quotes);
