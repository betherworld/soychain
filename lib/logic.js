/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
async function tradeSoybeans(trade) {

    // set the new owner of the commodity
    trade.soybean.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('org.soychain.mynetwork.Soybean');

    /*/ emit a notification that a trade has occurred
    let tradeNotification = getFactory().newEvent('org.soychain.mynetwork', 'TradeNotification');
    tradeNotification.commodity = trade.commodity;
    emit(tradeNotification);*/

    // persist the state of the commodity
    await assetRegistry.update(trade.soybean);
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Harvest} harvest - the trade to be processed
 * @transaction
 */
async function harvestSoybeans(harvest){
 	const factory = getFactory();
    const namespace = 'org.soychain.mynetwork';

  	const soybean = factory.newResource(namespace, 'Soybean', harvest.name); 
  
  	soybean.quantity = harvest.quantity;
    soybean.movementStatus = "ON_FIELD";
  	soybean.fieldId = harvest.field.fieldId;
  
  	if(harvest.field.limit - harvest.quantity < 0){
      return
    }
    harvest.field.limit = harvest.field.limit - harvest.quantity;
    const assetRegistry1 = await getAssetRegistry('org.soychain.mynetwork.Field');
    await assetRegistry1.update(harvest.field);
   
  	const assetRegistry = await getAssetRegistry(soybean.getFullyQualifiedType());
    await assetRegistry.add(soybean);
}


/*
 * Remove all high volume commodities
 * @param {org.soychain.mynetwork.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction
 *//*
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
}*/