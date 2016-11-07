
/*
  Project Title: E-commerce
  Date: 04/06/2016
  Programmer: <iamhabbeboy>
 */

(function() {
  var cartApp;

  cartApp = angular.module('qsApp', ['ngRoute', 'ngSanitize']);

  cartApp.config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/', {
        controller: 'homeCtl',
        templateUrl: 'home.html'
      }).when('/product', {
        controller: 'productCtl',
        templateUrl: 'product.html'
      }).when('/shop', {
        controller: 'shopCtl',
        templateUrl: 'shop.html'
      }).when('/catalog', {
        controller: 'catalogCtl',
        templateUrl: 'catalog.html'
      }).when('/delivery', {
        controller: 'deliveryCtl',
        templateUrl: 'delivery.html'
      }).when('/transaction', {
        controller: 'transactionCtl',
        templateUrl: 'transaction.html'
      }).when('/success', {
        controller: 'successCtl',
        templateUrl: 'success.html'
      }).when('/Qorder', {
        controller: 'QorderCtl',
        templateUrl: 'Qorder.html'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]);


  /*
    App Factory
   */

  cartApp.factory('cartFact', function() {
    var app;
    app = {};
    app.get = function(url) {
      return "http://localhost/endlessjoy.com.ng/api" + url;
    };
    return app;
  });

  cartApp.controller('homeCtl', function($scope, $http, cartFact) {
    $scope.productDel = function(id) {
      var confirm, uri;
      uri = cartFact.get('/qs_product/delete/' + id);
      confirm = window.confirm("Are you sure, you want to delete this ?");
      if (confirm) {
        angular.element($('.loader' + id).html("<img src='./images/loader.gif' border='0'/>"));
        return $http.get(uri).success(function(callback) {
          $scope.re = callback;
          $scope.loadel = void 0;
          return angular.element($('.tr' + id).fadeOut());
        }).error(function() {
          return alert("Network Error");
        });
      } else {

      }
    };
    return $scope.searchProduct = function() {
      var suri, val;
      val = $scope.q;
      if (val === "") {
        suri = cartFact.get('/qs_product/getSearch');
        angular.element($('.product-prd').html(""));
        angular.element($('#product-search').html("<img src='./images/loader.gif' border='0' alt='loading'>"));
        return $http.get(suri).success(function(callback) {
          return angular.element($('#product-search').html(callback));
        });
      } else {
        suri = cartFact.get('/qs_product/search');
        angular.element($('.product-prd').html(""));
        angular.element($('#product-search').html("<img src='./images/loader.gif' border='0' alt='loading'>"));
        return $http.post(suri, {
          q: val
        }).success(function(callback) {
          return angular.element($('#product-search').html(callback));
        });
      }
    };
  });

  cartApp.controller('productCtl', function($scope, cartFact, $http) {
    var image;
    $scope.stock_update = function(id) {
      angular.element($('.updateme' + id).hide());
      return angular.element($('.stock' + id).show());
    };
    $scope.stock_update_btn = function(id) {
      var edit, qtn_uri;
      edit = angular.element($('.edit_stock' + id));
      if (edit.val() === "" || edit.val() === "0") {
        edit.focus();
        return false;
      } else {
        angular.element($('.btn-update-qtn' + id).html("<img src='./images/loader.gif' border='0' width='15' height='15'/>"));
        qtn_uri = cartFact.get('/qs_product/product_qtn_update/' + id);
        return $http.post(qtn_uri, {
          edit: edit.val()
        }).success(function(a) {
          if (a === "done") {
            return window.location.reload();
          } else {
            return alert("Please Try Again Later, Internal Error ");
          }
        }).error(function() {
          return alert("Internet Network Error");
        });
      }
    };
    image = angular.element($('.image'));
    image.change(function() {
      angular.element($('#preview').html('<center><img src="./images/loader.gif" border="0"/><p><small>please wait...</small></p></center>'));
      return $(function() {
        return $('#ajaxForm').ajaxForm({
          url: 'public/frontend-ajax.php?action=fileUpload',
          'target': '#preview',
          beforeSend: function() {},
          success: function() {},
          error: function() {
            return alert("Internet Network Error !");
          }
        }).submit();
      });
    });
    $scope.rm_product_pix = function(key, pid) {
      var uri_pix;
      angular.element($('.rm_px_load' + key).html("<img src='./images/loader.gif' border='0' width='15' height='15'/><i><small> please wait...</small></i>"));
      uri_pix = cartFact.get('/qs_product/delData/' + key + '_' + pid);
      return $http.get(uri_pix).success(function(a) {
        return alert(a);
      }).error(function() {
        return alert("Internet Network Error !");
      });
    };
    return $scope.save_product = function(id) {
      var brand, category, desc, keyword, price, quantity, size, title, uri, weight;
      if (id == null) {
        id = 0;
      }
      category = angular.element($('.category'));
      image = $scope.upload_image;
      title = angular.element($('.product_title'));
      desc = angular.element($('.description'));
      brand = angular.element($('.brand_name'));
      weight = angular.element($('.weight'));
      size = angular.element($('.size'));
      quantity = angular.element($('.quantity'));
      price = angular.element($('.price'));
      keyword = angular.element($('.keyword'));

      /*
       validations
       */
      if (category.val() === "0") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Category is required";
        return category.focus();
      } else if (title.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Title is required";
        return title.focus();
      } else if (desc.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Description is required";
        return desc.focus();
      } else if (brand.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Brand Name is required";
        return brand.focus();
      } else if (weight.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Weight is required";
        return weight.focus();
      } else if (size.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Size is required";
        return size.focus();
      } else if (quantity.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Quantity is required";
        return quantity.focus();
      } else if (price.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Product Price is required";
        return price.focus();
      } else if (keyword.val() === "") {
        $scope.error_product = "<i class='fa fa-info'></i> Keyword is required";
        return keyword.focus();
      } else {
        uri = cartFact.get('/qs_product/post_product/' + id);
        return $http.post(uri, {
          'mcategory': category.val(),
          'title': title.val(),
          'description': desc.val(),
          'brand': brand.val(),
          'weight': weight.val(),
          'tax': '',
          'size': size.val(),
          'quantity': quantity.val(),
          'price': price.val(),
          'discountedprice': '',
          'totalprice': '',
          'tags': keyword.val(),
          'user_id': ''
        }).then(function(result) {
          if (result.data > 0) {
            alert("Product Saved Successfully !");
            return window.location.reload();
          } else if (result.data === "exist") {
            return alert("Product Already Exist !");
          } else if (result.data === "updated") {
            alert("Product Updated successfully !");
            return window.location.reload();
          } else {
            return alert("Error Occured While Saving !");
          }
        });
      }
    };
  });

  cartApp.controller('QorderCtl', function($scope, $http, cartFact) {
    return $scope.orderAction = function(id) {
      var action, uri_l;
      action = angular.element($('.action' + id));
      if (action.val() === "0") {
        alert("Please select an action");
        angular.element($('.action' + id).focus());
        return false;
      } else {
        angular.element($('.loadBtnUpdater' + id).html("<img src='./images/loader.gif' border='0' width='15' height='15'> <i><small>please wait..</small></i>"));
        uri_l = cartFact.get('/qs_order_shop/updateOrderAction/' + id);
        return $http.post(uri_l, {
          action: action.val()
        }).success(function(a) {
          if (a === "done") {
            window.location.reload();
          } else {
            alert("Internal Error Occured, please try reloading the browser !");
          }
          return angular.element($('.loadBtnUpdater' + id).html("submit"));
        }).error(function() {
          return alert("Please check the internet connection");
        });
      }
    };
  });

  cartApp.controller('shopCtl', function($scope, $http, cartFact, $location, $timeout) {
    $scope.makeOrder = function(id) {
      var url;
      angular.element($('#elemLoad').html("<img src='images/loader.gif' border='0' width='15' height='15'/> <i> please wait ...</i>"));
      url = cartFact.get('/qs_transaction/post_transfer/' + id);
      return $http.get(url).success(function(a) {
        if (a === "done") {
          return $location.path('/success');
        } else {
          return alert(a);
        }
      }).error(function() {
        return alert("Network Error");
      });
    };
    $scope.loader = "";
    return $scope.add_store = function() {
      var address, email, mobile, name;
      name = $scope.name;
      mobile = $scope.mobile;
      email = $scope.email;
      return address = $scope.address;
    };
  });

  cartApp.controller('deliveryCtl', function($scope) {});

  cartApp.controller('transactionCtl', function($scope) {
    return $scope.refresh = function() {
      return window.location.reload();
    };
  });

  cartApp.controller('successCtl', function($scope, $timeout, $location) {});

  cartApp.controller('catalogCtl', [
    '$scope', '$http', 'cartFact', '$timeout', function($scope, $http, cartFact, $timeout) {
      $scope.refresh = function() {
        return window.location.reload();
      };
      $scope.loader = "";
      $scope.add_menu = function() {
        var menu, url;
        menu = $scope.menu;
        if (menu === '' || menu === void 0) {
          return $scope.loader = "<font color='#993300'><small><i class='fa fa-info'></i> field is required</small></font>";
        } else {
          $scope.loader = "<img src='images/loader.gif' border='0'/>";
          url = cartFact.get('/qs_catalog/post_new_catalog');
          return $http.post(url, {
            menu: menu
          }).success(function(result) {
            if (result > 0) {
              $scope.loader = "<font color='green'><small><i class='fa fa-info'></i> Successfully Added</small></font>";
              return $timeout(function() {
                return window.location.reload();
              }, 1000);
            } else if (result === "exist") {
              return $scope.loader = "<font style='color:red'><small><i class='fa fa-info'></i> Catalog already exist !</small></font>";
            } else {
              return $scope.loader = "<font color='#993300'><small><i class='fa fa-info'></i>Error Occured !</small></font>";
            }
          }).error(function(er) {
            return $scope.loader = er;
          });
        }
      };
      $scope.loader = "";
      $scope.addSlides = function() {
        return angular.element($('#slidephoto').click());
      };
      $('#slidephoto').on('change', function() {
        angular.element($('.previewCol').html("<img src='images/loader.gif' border='0'/> <em><small>please wait...</small></em>"));
        return $('#slidephotoForm').ajaxForm({
          'target': '.previewCol'
        }).submit();
      });
      $scope.removeSlide = function(id) {
        var conf, url;
        conf = window.confirm("Are you sure you want to delete this ?");
        if (conf === true) {
          angular.element($('.lpix' + id).html("<img src='images/loader.gif' border='0' width='15' height='15'/>"));
          angular.element($('.hpix' + id).fadeOut('slow'));
          url = cartFact.get('/qs_product_slide/delete/' + id);
          return $http.get(url).success(function(result) {
            if (result > 0) {

            } else {
              return alert("Error Occured ");
            }
          }).error(function() {
            return alert("Network Error ");
          });
        } else {
          return false;
        }
      };
      $scope.viewSlide = function(url) {
        return window.location = url;
      };
      $scope.sub_links = function(menu) {};
      $scope.edit_menu = function(id) {
        $scope.change_menu = id;
        angular.element($('#menu_text' + id).hide());
        return angular.element($('#edit_show' + id).show());
      };
      $scope.save_menu = function(id) {
        var m, uri;
        m = $scope.m;
        uri = cartFact.get('/qs_catalog/put/' + id);
        return $http.post(uri, {
          menu: m
        }).success(function(callback) {
          if (callback > 0) {
            angular.element($('#menu_text' + id).show().html("<a href=\"#/\"><small><i class=\"fa fa-link\"></i> " + m + "</small></a>"));
            return angular.element($('#edit_show' + id).hide());
          } else {
            return alert("Error Occured !");
          }
        }).error(function(er) {
          return alert("" + er);
        });
      };
      $scope.open = function(id) {
        var conf, trash_uri;
        conf = window.confirm("Are you sure you want to delete ?");
        if (conf === true) {
          angular.element($('.trash' + id).html("<img src='./images/loader.gif' border='0' width='15' height='15'>"));
          trash_uri = cartFact.get('/qs_catalog/delete/' + id);
          return $http.get(trash_uri).success(function(a) {
            if (a > 0) {
              return angular.element($('.row_tr' + id).fadeOut('slow'));
            }
          }).error(function() {
            return alert("Internet Network Error ");
          });
        } else {
          return false;
        }
      };
      $scope.editCatalog = function(eid) {
        return angular.element($('.d' + eid).slideToggle('fast'));
      };
      $scope.addNewCatalog = function(id) {
        var sub, uri;
        sub = angular.element($('.sub_cat' + id));
        if (sub.val() === "") {
          sub.focus();
          return false;
        } else {
          uri = cartFact.get('/qs_catalog/postCat/' + id);
          angular.element($('.addNewCatalog').html("<img src='./images/loader.gif' border='0' width='15' height='15'>"));
          return $http.post(uri, {
            sub: sub.val()
          }).success(function(callback) {
            if (callback > 0) {
              angular.element($('.list-new').prepend("<li class=\"list-group-item\"><div class=\"no-spacing col-md-9\">" + sub.val() + "</div> <div class=\"col-md-3\"> <a style=\"cursor: pointer;\"><i class=\"fa fa-edit\"></i></a> &nbsp; <a style=\"cursor: pointer;\"><i class=\"fa fa-times\"></i></a></div> <div class=\"clearfix\"></div></li>"));
              sub.val('');
            } else if (callback === "exist") {
              alert("Sub Catalog already exist");
            } else {
              alert("Error Occured !");
            }
            return angular.element($('.addNewCatalog').html("<i class=\"fa fa-circle-plus\"></i> Add <i class=\"fa fa-plus-circle\"></i>"));
          }).error(function() {
            return alert("Network Error");
          });
        }
      };
      $scope.subEdit = function(key, val) {
        angular.element($('.edt' + key).html("<input type='text' class='form-control edtEnter" + key + "' value='" + val + "' >"));
        angular.element($('.editCatBtn' + key).html("<a href='#' class='btnUpdateCat' data-id='" + key + "'><i class='fa fa-check'></i> ok</a>"));
        return $(function() {
          return $('.btnUpdateCat').on('click', function(e) {
            var edt, id, uri_l;
            e.preventDefault();
            id = $(this).attr('data-id');
            edt = $('.edtEnter' + id);
            if (edt.val() === "") {
              edt.focus();
              return false;
            } else {
              uri_l = cartFact.get('/qs_catalog/updateCat/' + id);
              return $http.post(uri_l, {
                val: edt.val()
              }).success(function(callback) {
                if (callback === "done") {
                  angular.element($('.edt' + key).html(edt.val()));
                  return angular.element($('.editCatBtn' + id).html('<a style="cursor: pointer;"><i class="fa fa-edit"></i></a>'));
                } else {
                  return alert("Error Occured");
                }
              }).error(function() {
                return alert("Please check the internet connection");
              });
            }
          });
        });
      };
      return $scope.subDel = function(key) {
        var conf, uri_l;
        conf = window.confirm("Are you sure you want to delete ?, Note that all product under this category will not be accessible !");
        if (conf === true) {
          angular.element($('.subDelLoader' + key).html("<img src='./images/loader.gif' border='0' width='15' height='15'>"));
          uri_l = cartFact.get('/qs_catalog/delete/' + key);
          return $http.get(uri_l).success(function(callback) {
            if (callback > 0) {
              return angular.element($('.listCat' + key).fadeOut('slow'));
            } else {
              return alert("Error Occured !");
            }
          }).error(function() {
            return alert("Please check the internet connection ");
          });
        } else {
          return false;
        }
      };
    }
  ]);


  /*
   jQuery Code
   */

}).call(this);
