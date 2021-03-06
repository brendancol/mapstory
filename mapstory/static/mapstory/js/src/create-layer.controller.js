/*
 *  CreateLayer & CreateLayerModal
 */
(() => {
  function createLayerModalCtrl(
    $scope,
    $modalInstance,
    $http,
    modalImage,
    staticUrl,
    brandingLayerName,
    brandingLayersName
  ) {
    $scope.staticUrl = staticUrl;
    $scope.modalImage = modalImage;
    $scope.processing = false;
    $scope.BRANDING_LAYER_NAME = brandingLayerName;
    $scope.BRANDING_LAYERS_NAME = brandingLayersName;
    $scope.layer = {
      configuration_options: {
        attributes: {
          attribute: [
            {
              name: "geometry",
              binding: "com.vividsolutions.jts.geom.Point",
              minOccurs: 0,
              nillable: true
            },
            {
              name: "time",
              binding: "org.geotools.data.postgis.BigDate",
              nillable: true,
              minOccurs: 0
            }
          ]
        },
        nativeCRS: "EPSG:4326",
        srs: "EPSG:4326",
        store: { name: "mapstory_geogig" },
        namespace: { name: "geonode" },
        configureTime: true,
        editable: true
      }
    };

    $scope.defaultAttribute = {
      name: "",
      binding: "",
      nillable: true,
      minOccurs: 0
    };
    $scope.geometryTypes = [
      { label: "Point", value: "com.vividsolutions.jts.geom.Point" },
      { label: "Line", value: "com.vividsolutions.jts.geom.LineString" },
      { label: "Polygon", value: "com.vividsolutions.jts.geom.Polygon" },
      { label: "Geometry", value: "com.vividsolutions.jts.geom.Geometry" },
      { label: "Multi-Point", value: "com.vividsolutions.jts.geom.MultiPoint" },
      {
        label: "Multi-Line",
        value: "com.vividsolutions.jts.geom.MultiLineString"
      },
      {
        label: "Multi-Polygon",
        value: "com.vividsolutions.jts.geom.MultiPolygon"
      },
      {
        label: "Multi-Geometry",
        value: "com.vividsolutions.jts.geom.MultiGeometry"
      }
    ];

    $scope.attributeTypes = [
      { label: "Text", value: "java.lang.String" },
      { label: "Number", value: "java.lang.Double" },
      { label: "Date", value: "org.geotools.data.postgis.BigDate" }
    ];

    $scope.createLayer = () => {
      $scope.processing = true;
      $scope.errors = [];
      $scope.setDefaultPermissions($scope.layer.configuration_options.editable);
      $http
        .post("/layers/create", {
          featureType: $scope.layer.configuration_options
        })
        .then(
          response => {
            $scope.processing = false;
            $scope.success = true;
            $scope.createdLayers = response.data.layers;
          },
          response => {
            $scope.processing = false;
            $scope.errors = response.data.errors;
          }
        );
    };

    $scope.setDefaultPermissions = edit => {
      $scope.layer.configuration_options.permissions = {
        users: {
          AnonymousUser: [
            "change_layer_data",
            "download_resourcebase",
            "view_resourcebase"
          ]
        },
        groups: {
          registered: [
            "change_layer_data",
            "download_resourcebase",
            "view_resourcebase"
          ]
        }
      };

      if (edit === false) {
        $scope.layer.configuration_options.permissions = {
          users: {
            AnonymousUser: ["download_resourcebase", "view_resourcebase"]
          },
          groups: { registered: ["download_resourcebase", "view_resourcebase"] }
        };
      }
      $scope.layer.configuration_options.storeCreateGeogig = true;
    };

    $scope.addDefaultAttribute = () => {
      $scope.layer.configuration_options.attributes.attribute.push(
        angular.copy($scope.defaultAttribute)
      );
    };

    $scope.remove = item => {
      const index = $scope.layer.configuration_options.attributes.attribute.indexOf(
        item
      );
      $scope.layer.configuration_options.attributes.attribute.splice(index, 1);
    };

    $scope.nameValid = () => {
      if (
        !Object.prototype.hasOwnProperty.call(
          !$scope.layer.configuration_options,
          "name"
        )
      ) {
        return false;
      }
      return true;
    };

    $scope.ok = () => {
      $modalInstance.dismiss("cancel");
    };

    $scope.cancel = () => {
      $modalInstance.dismiss("cancel");
    };
  }
  function createLayerCtrl($scope, $uibModal) {
    $scope.open = function open(
      templateUrl,
      modalImage,
      staticUrl,
      brandingLayerName,
      brandingLayersName
    ) {
      const modalInstance = $uibModal.open({
        animation: true,
        templateUrl: templateUrl || "importWizard.html",
        controller: "createLayerModalCtrl",
        resolve: {
          modalImage() {
            return modalImage;
          },
          staticUrl() {
            return staticUrl;
          },
          brandingLayerName() {
            return brandingLayerName;
          },
          brandingLayersName() {
            return brandingLayersName;
          }
        }
      });

      modalInstance.result.then(
        selectedItem => {
          $scope.selected = selectedItem;
        },
        () => {
          console.log(`Modal dismissed at: ${new Date()}`);
        }
      );
    };
  }
  angular
    .module("mapstory")
    .controller("createLayerCtrl", createLayerCtrl)
    .controller("createLayerModalCtrl", createLayerModalCtrl);
})();
