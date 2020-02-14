import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from '../../contexts/store-context';
import usePromise from '../../hooks/use-promise';
import { CacheKeys } from '../../constants';
import './quotes.scss';


function Quotes(props) {
  const { percentOfDayRemaining } = props;

  const { generalStore } = React.useContext(StoreContext);

  const [quote] = usePromise(() => generalStore.getQuote({ percentOfDayRemaining }), {
    cacheKey: CacheKeys.quote,
    cachePeriodInSecs: (60 * 60),
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


Quotes.propTypes = {
  percentOfDayRemaining: PropTypes.number.isRequired,
};


export default React.memo(Quotes);
