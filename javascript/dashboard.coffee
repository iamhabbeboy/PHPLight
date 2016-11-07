###
  Project Title: E-commerce
  Date: 04/06/2016
  Programmer: <iamhabbeboy>
###
cartApp = angular.module('qsApp', ['ngRoute', 'ngSanitize'])
cartApp.config ['$routeProvider', ($routeProvider) ->
  $routeProvider
   .when '/',
     controller: 'homeCtl',
     templateUrl: 'home.html'
   .when '/product',
     controller: 'productCtl',
     templateUrl: 'product.html'
   .when '/shop',
     controller: 'shopCtl',
     templateUrl: 'shop.html'
   .when '/catalog',
     controller: 'catalogCtl',
     templateUrl: 'catalog.html'
   .when '/delivery',
     controller: 'deliveryCtl',
     templateUrl: 'delivery.html'
   .when '/transaction',
      controller: 'transactionCtl',
      templateUrl: 'transaction.html'
    .when '/success',
      controller: 'successCtl',
      templateUrl: 'success.html'
    .when '/Qorder',
      controller: 'QorderCtl',
      templateUrl: 'Qorder.html'
   .otherwise redirectTo: '/'
]

###
  App Factory
###

cartApp.factory 'cartFact', () ->
  app = {}
  app.get = (url) ->
    return "http://localhost/endlessjoy.com.ng/api"+ url
  return app

cartApp.controller 'homeCtl', ( $scope, $http, cartFact ) ->
  #$scope.text = 'Hello world !
  $scope.productDel = (id) ->
    uri = cartFact.get( '/qs_product/delete/'+id )
    confirm = window.confirm "Are you sure, you want to delete this ?"
    if confirm
      #$scope.loadel = "<img src='./images/loader.gif' border='0'/>"
      angular.element $('.loader'+id). html "<img src='./images/loader.gif' border='0'/>"
      $http.get uri
      .success (callback) ->
        $scope.re = callback
        $scope.loadel = undefined
        angular.element $('.tr'+id). fadeOut()
      .error () ->
        alert "Network Error"
    else

  $scope.searchProduct = () ->
    val = $scope.q
    if val is ""
      suri = cartFact.get( '/qs_product/getSearch' )
      angular.element $('.product-prd'). html ""
      angular.element $('#product-search'). html "<img src='./images/loader.gif' border='0' alt='loading'>"
      $http.get suri
      .success (callback) ->
        angular.element $('#product-search'). html callback
    else
      suri = cartFact.get( '/qs_product/search' )
      angular.element $('.product-prd'). html ""
      angular.element $('#product-search'). html "<img src='./images/loader.gif' border='0' alt='loading'>"
      $http.post suri,
       q : val
      .success (callback) ->
        angular.element $('#product-search'). html callback


cartApp.controller 'productCtl', ($scope, cartFact, $http) ->

  $scope.stock_update = ( id ) ->
    angular.element $('.updateme' + id).hide()
    angular.element $('.stock'+ id ).show()

  $scope.stock_update_btn = ( id ) ->
    edit = angular.element $('.edit_stock' + id )
    if edit.val() is "" or edit.val() is "0"
      edit.focus()
      false
    else
      angular.element $( '.btn-update-qtn'+ id ). html "<img src='./images/loader.gif' border='0' width='15' height='15'/>"
      qtn_uri = cartFact.get('/qs_product/product_qtn_update/' + id )
      $http.post qtn_uri,
        edit: edit.val()
      .success (a) ->
        if a is "done"
          window.location.reload()
        else
          alert "Please Try Again Later, Internal Error "
      .error () ->
        alert "Internet Network Error"


  image = angular.element $('.image')
  image.change () ->
    angular.element $('#preview').html '<center><img src="./images/loader.gif" border="0"/><p><small>please wait...</small></p></center>'
    $ ->
      $('#ajaxForm').ajaxForm
        url: 'public/frontend-ajax.php?action=fileUpload',
        'target' : '#preview',
        beforeSend: () ->,
        success: () ->,
        error: () ->
         alert "Internet Network Error !"
      .submit()

  $scope.rm_product_pix = (key, pid) ->
    angular.element $('.rm_px_load'+key).html "<img src='./images/loader.gif' border='0' width='15' height='15'/><i><small> please wait...</small></i>"
    uri_pix = cartFact.get('/qs_product/delData/'+key+'_'+pid)
    $http.get uri_pix
    .success (a) ->
      alert a
    .error () ->
      alert "Internet Network Error !"

  $scope.save_product = ( id = 0) ->
    category = angular.element $('.category')
    image = $scope.upload_image
    title = angular.element $('.product_title')
    desc  = angular.element $('.description')
    brand = angular.element $('.brand_name')
    weight = angular.element $('.weight')
    size = angular.element $('.size')
    quantity = angular.element $('.quantity')
    price = angular.element $('.price')
    keyword = angular.element $('.keyword')
    #disc_price = angular.$disc_price
    #total_price = $scope.total_price
    ###
     validations
    ###
    if category.val() is "0"
      $scope.error_product = "<i class='fa fa-info'></i> Product Category is required"
      category.focus()
    else if title.val() is ""
      $scope.error_product = "<i class='fa fa-info'></i> Product Title is required"
      title.focus()
    else if desc.val() is ""
      $scope.error_product = "<i class='fa fa-info'></i> Product Description is required"
      desc.focus()
    else if brand.val() is ""
      $scope.error_product = "<i class='fa fa-info'></i> Brand Name is required"
      brand.focus()
    else if weight.val() is ""
      $scope.error_product = "<i class='fa fa-info'></i> Product Weight is required"
      weight.focus()
    else if size.val() is ""
      $scope.error_product = "<i class='fa fa-info'></i> Product Size is required"
      size.focus()
    else if quantity.val() is ""
       $scope.error_product = "<i class='fa fa-info'></i> Product Quantity is required"
       quantity.focus()
    else if price.val() is ""
        $scope.error_product = "<i class='fa fa-info'></i> Product Price is required"
        price.focus()
    else if keyword.val() is ""
        $scope.error_product = "<i class='fa fa-info'></i> Keyword is required"
        keyword.focus()
    else
      uri = cartFact.get('/qs_product/post_product/' + id )
      $http.post uri,
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
      .then (result) ->
        if result.data > 0
          alert("Product Saved Successfully !")
          window.location.reload()
        else if result.data is "exist"
          alert("Product Already Exist !")
        else if result.data is "updated"
          alert("Product Updated successfully !")
          window.location.reload()
        else
          alert("Error Occured While Saving !")


cartApp.controller 'QorderCtl', ($scope, $http, cartFact) ->
  $scope.orderAction = (id) ->
    action = angular.element $('.action'+id)
    if action.val() is "0"
      alert "Please select an action"
      angular.element $('.action'+id).focus()
      false
    else
      angular.element $('.loadBtnUpdater'+id).html "<img src='./images/loader.gif' border='0' width='15' height='15'> <i><small>please wait..</small></i>"
      uri_l = cartFact.get('/qs_order_shop/updateOrderAction/'+ id )
      $http.post uri_l,
        action: action.val()
      .success (a) ->
        if a is "done"
          window.location.reload()
        else
          alert "Internal Error Occured, please try reloading the browser !"
        angular.element $('.loadBtnUpdater'+id).html "submit"
      .error () ->
        alert "Please check the internet connection"


cartApp.controller 'shopCtl', ($scope, $http, cartFact, $location, $timeout) ->
  $scope.makeOrder = (id) ->
    angular.element $('#elemLoad').html "<img src='images/loader.gif' border='0' width='15' height='15'/> <i> please wait ...</i>"
    url = cartFact.get('/qs_transaction/post_transfer/'+id)
    $http.get url
    .success (a) ->
      if a is "done"
        $location.path('/success')
      else
        alert a
    .error () ->
      alert "Network Error"

  $scope.loader = ""
  $scope.add_store = () ->
   name = $scope.name
   mobile = $scope.mobile
   email = $scope.email
   address = $scope.address

cartApp.controller 'deliveryCtl', ($scope) ->


cartApp.controller 'transactionCtl', ($scope) ->

  $scope.refresh = () ->
   window.location.reload()
cartApp.controller 'successCtl', ($scope, $timeout, $location) ->

cartApp.controller 'catalogCtl', ['$scope', '$http', 'cartFact', '$timeout', ($scope, $http, cartFact, $timeout) ->
    $scope.refresh = () ->
      window.location.reload()

    $scope.loader = ""
    $scope.add_menu = () ->

     menu = $scope.menu
     if menu is '' or menu is undefined
       $scope.loader = "<font color='#993300'><small><i class='fa fa-info'></i> field is required</small></font>"
     else
       $scope.loader = "<img src='images/loader.gif' border='0'/>"
       url = cartFact.get('/qs_catalog/post_new_catalog')
       $http.post url, menu: menu
       .success (result) ->
         if result > 0
          $scope.loader = "<font color='green'><small><i class='fa fa-info'></i> Successfully Added</small></font>"
          $timeout () ->
            window.location.reload()
          , 1000
         else if result is "exist"
          $scope.loader = "<font style='color:red'><small><i class='fa fa-info'></i> Catalog already exist !</small></font>"
         else
          $scope.loader = "<font color='#993300'><small><i class='fa fa-info'></i>Error Occured !</small></font>"
       .error (er) ->
         $scope.loader = er
    $scope.loader = ""

    $scope.addSlides = () ->
      angular.element $('#slidephoto').click()
    $('#slidephoto').on 'change', () ->
      angular.element $('.previewCol').html "<img src='images/loader.gif' border='0'/> <em><small>please wait...</small></em>"
      $('#slidephotoForm').ajaxForm
         'target':'.previewCol'
      .submit()
    $scope.removeSlide = (id) ->
      conf = window.confirm("Are you sure you want to delete this ?")
      if conf is true
        angular.element $('.lpix'+id).html "<img src='images/loader.gif' border='0' width='15' height='15'/>"
        angular.element $('.hpix'+id).fadeOut 'slow'
        url = cartFact.get('/qs_product_slide/delete/'+ id)
        $http.get url
        .success (result) ->
          if result > 0
          else
            alert "Error Occured "
        .error () ->
          alert "Network Error "
      else
        false
    $scope.viewSlide = (url) ->
      window.location = url

    $scope.sub_links = (menu) ->
      #$scope.subLinks = menu

    $scope.edit_menu = (id) ->
      $scope.change_menu = id
      angular.element $('#menu_text'+id).hide()
      angular.element $('#edit_show'+id).show()

    $scope.save_menu = (id) ->
      m = $scope.m
      uri = cartFact.get('/qs_catalog/put/'+id)
      $http.post uri, menu: m
      .success (callback) ->
         if callback > 0
           angular.element $('#menu_text'+id).show().html("<a href=\"#/\"><small><i class=\"fa fa-link\"></i> "+m+"</small></a>")
           angular.element $('#edit_show'+id).hide()
         else
           alert "Error Occured !"
      .error (er) ->
        alert "#{er}"

    $scope.open = ( id ) ->
      conf = window.confirm("Are you sure you want to delete ?")
      if conf is true
        angular.element $('.trash' + id ).html "<img src='./images/loader.gif' border='0' width='15' height='15'>"
        trash_uri = cartFact.get('/qs_catalog/delete/'+id)
        $http.get trash_uri
        .success (a) ->
          if a > 0
            angular.element $('.row_tr' + id ).fadeOut('slow')
        .error () ->
          alert "Internet Network Error "
      else
        false

    $scope.editCatalog = (eid) ->
      angular.element $('.d'+eid). slideToggle('fast')

    $scope.addNewCatalog = (id) ->
      sub = angular.element $('.sub_cat'+id)
      if sub.val() is ""
        sub.focus()
        false
      else
        uri = cartFact.get('/qs_catalog/postCat/'+id)
        angular.element $('.addNewCatalog').html "<img src='./images/loader.gif' border='0' width='15' height='15'>"
        $http.post uri,
          sub: sub.val()
        .success (callback) ->
          if callback > 0
            angular.element $('.list-new').prepend "<li class=\"list-group-item\"><div class=\"no-spacing col-md-9\">"+sub.val()+"</div> <div class=\"col-md-3\">
                <a style=\"cursor: pointer;\"><i class=\"fa fa-edit\"></i></a> &nbsp; <a style=\"cursor: pointer;\"><i class=\"fa fa-times\"></i></a></div>
                  <div class=\"clearfix\"></div></li>"
            sub.val('')
          else if callback is "exist"
            alert "Sub Catalog already exist"
          else
            alert "Error Occured !"
          angular.element $('.addNewCatalog').html "<i class=\"fa fa-circle-plus\"></i> Add <i class=\"fa fa-plus-circle\"></i>"

        .error () ->
          alert "Network Error"

    $scope.subEdit = (key, val) ->
      angular.element $('.edt'+key).html "<input type='text' class='form-control edtEnter"+key+"' value='"+val+"' >"
      angular.element $('.editCatBtn'+key).html "<a href='#' class='btnUpdateCat' data-id='"+key+"'><i class='fa fa-check'></i> ok</a>"

      $ ->
        $('.btnUpdateCat').on 'click', (e) ->
          e.preventDefault()
          id = $(this).attr 'data-id'
          edt = $('.edtEnter'+id)
          if edt.val() is ""
            edt.focus()
            false
          else
            uri_l = cartFact.get('/qs_catalog/updateCat/'+ id )
            $http.post uri_l,
              val: edt.val()
            .success (callback) ->
              if callback is "done"
                angular.element $('.edt'+key).html edt.val()
                angular.element $('.editCatBtn'+id).html '<a style="cursor: pointer;"><i class="fa fa-edit"></i></a>'
              else
                alert "Error Occured"
            .error () ->
              alert "Please check the internet connection"

    $scope.subDel = (key) ->
      conf = window.confirm("Are you sure you want to delete ?, Note that all product under this category will not be accessible !")
      if conf is true
        angular.element $('.subDelLoader'+ key ).html "<img src='./images/loader.gif' border='0' width='15' height='15'>"
        uri_l = cartFact.get( '/qs_catalog/delete/'+ key )
        $http.get uri_l
        .success (callback) ->
          if callback > 0
            angular.element $('.listCat'+key).fadeOut('slow')
          else
            alert "Error Occured !"
        .error () ->
          alert "Please check the internet connection "
      else
        false

]

###
 jQuery Code
###
