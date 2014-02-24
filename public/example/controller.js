module.exports = ['$scope', 'PetResource', function($scope, PetResource){
  'use strict';

  $scope.data = {
    title: 'Pets',
    loading: true,
    status: 'Welcome!',
    pets: PetResource.query(function loaded(){
      $scope.data.loading = false;
    })
  };

  $scope.addPetForm = {
    name: '',
    age: 0,
    add: function(){
      var pet = new PetResource();
      pet.name = $scope.addPetForm.name;
      pet.age = $scope.addPetForm.age;
      pet.$save(function(){
        $scope.addPetForm.name = '';
        $scope.addPetForm.age = 0;
        $scope.data.pets = PetResource.query();
        $scope.data.status = 'Successfully added pet.';
      }, function(data){
        $scope.data.status = 'Failed to add pet';
        if(typeof data.data.error !== 'undefined'){
          $scope.data.status = $scope.data.status + ': ' + data.data.error;
        }
      });
    }
  };

  $scope.fn = {
    deletePet: function(id){
      var pet = new PetResource();
      pet._id = id;
      pet.$delete(
        function success(){
          $scope.data.pets = PetResource.query();
          $scope.data.status = 'Successfully deleted pet.';
        },
        function failure(data){
          $scope.data.status = 'Failed to delete pet';
          if(typeof data.data.error !== 'undefined'){
            $scope.data.status = $scope.data.status + ': ' + data.data.error;
          }
        }
      );
    }
  };

}];