/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Trade} trade - the trade to be processed
 * @transaction
 */
// trade function for trade betweend farmers, trader und buyer
async function tradeSoybeans(trade) {
  const quantity = trade.soybean.quantity;//quantity of soybeans available to trade
  if (quantity < trade.quantity){
    throw new Error('cant trade more than available from tradePartner');
  }
  if (quantity == trade.quantity){
    //no splitting of soybeans required
    trade.soybean.owner = trade.to;
  }else{
    //create one new instance of soybeans with the reduced quantity
    const factory = getFactory();
    const namespace = 'org.soychain.mynetwork';
    const soybean = factory.newResource(namespace, 'Soybean', trade.splittingName); 

    soybean.quantity = trade.quantity;
    soybean.movementStatus = "ON_FIELD";
    soybean.fieldId = trade.soybean.fieldId;
    soybean.owner = trade.to;
    const assetRegistry = await getAssetRegistry(soybean.getFullyQualifiedType());
    await assetRegistry.add(soybean);

    trade.soybean.quantity = quantity - trade.quantity;
  }
  let assetRegistry = await getAssetRegistry('org.soychain.mynetwork.Soybean');
  await assetRegistry.update(trade.soybean);
}

/**
 * Track the trade of a commodity from one trader to another
 * @param {org.soychain.mynetwork.Harvest} harvest - the trade to be processed
 * @transaction
 */
// function for harvesting soybeans by farmer
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
// merge assets in case soybeans are from same field
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
// split asset in case only part of the harvest is traded
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