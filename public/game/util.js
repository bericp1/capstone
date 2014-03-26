module.exports = (function(){
  'use strict';
  return {
    loadResourcesFromObject: function(game, resources){
      for(var resourceType in resources){
        if(resources.hasOwnProperty(resourceType)){
          for(var resourceID in resources[resourceType]){
            if(resources[resourceType].hasOwnProperty(resourceID)){
              var resourceArgs = [resourceID];
              for(var i = 0; i < resources[resourceType][resourceID].length; i++){
                resourceArgs.push(resources[resourceType][resourceID][i]);
              }
              game.load[resourceType].apply(game.load, resourceArgs);
            }
          }
        }
      }
    }
  };
})();