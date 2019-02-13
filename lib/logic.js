/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeCommodity(trade) {

    // set the new owner of the commodity
    trade.commodity.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('org.soychain.mynetwork.Commodity');

    // emit a notification that a trade has occurred
    let tradeNotification = getFactory().newEvent('org.soychain.mynetwork', 'TradeNotification');
    tradeNotification.commodity = trade.commodity;
    emit(tradeNotification);

    // persist the state of the commodity
    await assetRegistry.update(trade.commodity);
}

/**
 * Remove all high volume commodities
 * @param {org.soychain.mynetwork.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 */
async function removeHighQuantityCommodities(remove) {

    let assetRegistry = await getAssetRegistry('org.soychain.mynetwork.Commodity');
    let results = await query('selectCommoditiesWithHighQuantity');

    for (let n = 0; n < results.length; n++) {
        let trade = results[n];

        // emit a notification that a trade was removed
        let removeNotification = getFactory().newEvent('org.soychain.mynetwork','RemoveNotification');
        removeNotification.commodity = trade;
        emit(removeNotification);
        await assetRegistry.remove(trade);
    }
}
