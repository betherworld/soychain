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
    soybean.movementStatus = "HARVESTED";
  	soybean.fieldId = harvest.field.fieldId;
  	soybean.owner = factory.newRelationship(namespace, 'Farmer', harvest.owner.getIdentifier());
  
  	if(harvest.field.limit - harvest.quantity < 0){
      return
    }
    harvest.field.limit = harvest.field.limit - harvest.quantity;
    const assetRegistry1 = await getAssetRegistry('org.soychain.mynetwork.Field');
    await assetRegistry1.update(harvest.field);
   
  	const assetRegistry = await getAssetRegistry(soybean.getFullyQualifiedType());
    await assetRegistry.add(soybean);
}


/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Merge} merge - the trade to be processed
 * @transaction
 */
async function mergeSoybeans(merge){
  
  if(merge.bean1.fieldId != merge.bean2.fieldId){
  	return;
  }
  
  merge.bean1.quantity += merge.bean2.quantity;
  
  const assetRegistry1 = await getAssetRegistry('org.soychain.mynetwork.Soybean');
  await assetRegistry1.update(merge.bean1);
  
  return getAssetRegistry('org.soychain.mynetwork.Soybean')
  	.then(function (soybeanAssetRegistry) {
      var factory = getFactory();
    // Remove the Soybean from the soybean asset registry.
    return soybeanAssetRegistry.remove(merge.bean2);
  })
  .catch(function (error) {
    // Add optional error handling here.
  });
     
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Split} split - the trade to be processed
 * @transaction
 */
async function splitSoybeans(split){
  
  if(split.bean1.quantity < split.quantity){
    return
  }
  
  	const factory = getFactory();
    const namespace = 'org.soychain.mynetwork';	
  
  	const soybean = factory.newResource(namespace, 'Soybean', split.bean2); 
  	soybean.quantity = split.quantity;
  	soybean.fieldId = split.bean1.fieldId;
  	soybean.movementStatus = split.bean1.movementStatus;
  	soybean.owner = split.bean1.owner;
  
   	const assetRegistry = await getAssetRegistry(soybean.getFullyQualifiedType());
    await assetRegistry.add(soybean);

	split.bean1.quantity = split.bean1.quantity - split.quantity;
  	const assetRegistry1 = await getAssetRegistry('org.soychain.mynetwork.Soybean');
  	await assetRegistry1.update(split.bean1);
  
}