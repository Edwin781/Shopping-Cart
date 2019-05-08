
$(document).ready(function () {



    var mainElement = document.getElementById('contentPage');

    $(':input[required]').siblings('label').append($('<span>').text('*').addClass('requiredMarker'));
    var itemid = document.getElementById('itemid')
    itemid.oninput = function (e) {
        e.target.setCustomValidity("");
    };
    itemid.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (e.target.validity.valid == false) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("This field  is required");
            }
            else if (e.target.value.length < 8) {
                e.target.setCustomValidity("Item ID must be at least 8 characters.");
            }
            else if (e.target.value.length > 8) {
                e.target.setCustomValidity("Item ID must be only 8 characters.");
            }

        }
    };

    var itemname = document.getElementById('itemname')
    itemname.oninput = function (e) {
        e.target.setCustomValidity("");
    };
    itemname.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (e.target.validity.valid == false) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("This Field is required");
            }
            else if (e.target.value.length < 5) {
                e.target.setCustomValidity("item Name must be at least 5 characters.");
            }
        }
    };

    var itemdesc = document.getElementById('itemdesc')
    itemdesc.oninput = function (e) {
        e.target.setCustomValidity("");
    };
    itemdesc.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (e.target.validity.valid == false) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("The Item Description is required");
            }

        }
    };

    var itemquantity = document.getElementById('itemquantity')
    itemquantity.oninput = function (e) {
        e.target.setCustomValidity("");
    };
    itemquantity.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (e.target.validity.valid == false) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("The Item Quantity is required");
            }
            else if (e.target.value == 0) {
                e.target.setCustomValidity("item Quantity must be more than zero.");
            }
        }
    };

    var ItemUnitPrice = document.getElementById('ItemUnitPrice')
    ItemUnitPrice.oninput = function (e) {
        e.target.setCustomValidity("");
    };
    ItemUnitPrice.oninvalid = function (e) {
        e.target.setCustomValidity("");
        if (e.target.validity.valid == false) {
            if (e.target.value.length == 0) {
                e.target.setCustomValidity("The Item Quantity is required");
            }
            else if (e.target.value == 0) {
                e.target.setCustomValidity("item Unit Price must be more than zero.");
            }
        }
    };


    //Declare variables for calculations
    var Subtotal = 0;
    var Shipping = 0;
    var Tax = 0;
    var Total = 0;
    var cost = 0;


    //This function loads the total.
    function loadtotal() {


        $("#Subtotal").val(Subtotal.toFixed(2));
        $("#Shipping").val(Shipping.toFixed(2));
        $("#Tax").val(Tax.toFixed(2));
        $("#Total").val(Total.toFixed(2));


    }


    $("#itemquantity, #ItemUnitPrice").on("input", function () {
        cost = $("#itemquantity").val() * $("#ItemUnitPrice").val();

        $("#ItemCost").val(cost.toFixed(2));
    });
    loadContent();

    //This deletes an item
    $(mainElement).on("click", "a.delete",
        function (evt) {
            evt.preventDefault();
            deletecontent(evt);

            //Reloads page after execution
            location.reload();
        });

    //Add to cart click event
    $(mainElement).find('form input[type="submit"]').click(
         function (evt) {
             //evt.preventDefault();
             //  savecontent();


             if ($(evt.target).parents('form')[0].checkValidity()) {

                 evt.preventDefault();
                 savecontent();
             }
         });


    //This event deletes all items onclick.
    $(mainElement).find("a.deleteAll").click(
            function (evt) {
                evt.preventDefault();
                localStorage.clear();
                $(mainElement).find('table tbody').remove();
                //Reloads page after execution
                location.reload();
            }
          );




    //This function loads the contents
    function loadContent() {
        var contentsStored = localStorage.getItem('contents');
        if (contentsStored) {
            contents = JSON.parse(contentsStored);
            $.each(contents, function (index, content) {
                var row = $('<tr>');
                var html = '<td>' + content.invoicedate + '</td>' +
                           '<td>' + content.itemid + '</td>' +
                            '<td>' + content.itemname + '</td>' +
                             '<td>' + content.itemdesc + '</td>' +
                               '<td>' + content.itemquantity + '</td>' +
                            '<td>' + content.ItemUnitPrice + '</td>' +
                            '<td>' + content.ItemCost + '</td>' +

                           '<td><a class="delete" href="#">delete</a></td>';

                row.data().contentId = content.id;

                row.append(html);
                $(mainElement).find('table tbody').append(row);

                Subtotal = Subtotal + (content.itemquantity * content.ItemUnitPrice);
                Shipping = .085 * Subtotal;
                Tax = .11 * Subtotal + Shipping;
                Total = Subtotal + Shipping + Tax;
            });

            loadtotal();
        }
    }

    //Stores the record in the cart so even if you refresh, the items in the cart dont go away
    function store(content) {
        var contentsStored = localStorage.getItem('contents');
        var contents = [];
        if (contentsStored) {
            contents = JSON.parse(contentsStored);
        }
        contents.push(content);
        localStorage.setItem('contents', JSON.stringify(contents));
    }


    // This function is called when the add to cart button is clicked. It saves the user input into the designated fields.
    function savecontent() {
        var content = serializeForm();
        content.id = $.now();
        var row = $('<tr>');
        var html = '<td>' + content.invoicedate + '</td>' +
            '<td>' + content.itemid + '</td>' +
            '<td>' + content.itemname + '</td>' +
            '<td>' + content.itemdesc + '</td>' +
            '<td>' + content.itemquantity + '</td>' +
            '<td>' + content.ItemUnitPrice + '</td>' +
            '<td>' + content.ItemCost + '</td>' +
              '<td><a class="delete" href="#">delete</a></td>';
        row.data().contentId = content.id;
        row.append(html);
        store(content);
        $(mainElement).find('table tbody').append(row);
        $(mainElement).find('form :input[name]').val('');
        //Reloads page after execution
        location.reload();
    }

    //This funcrtion deletes item that are stored.
    function deletecontent(evt) {
        var contentId = $(evt.target).parents('tr').data().contentId;
        var contents = JSON.parse(localStorage.getItem('contents'));
        var newcontents = contents.filter(function (c) {
            return c.id != contentId;
        });
        localStorage.setItem('contents', JSON.stringify(newcontents));
        $(evt.target).parents('tr').remove();
    }

    $(mainElement).on("click", "a.delete",
   function (evt) {
       evt.preventDefault();
       deletecontent(evt);
   }
);



    //This function serializes the form 
    function serializeForm() {
        var inputFields = $(mainElement).find('form :input');
        var result = {};
        $.each(inputFields, function (index, value) {
            if ($(value).attr('name')) {
                result[$(value).attr('name')] = $(value).val();
            }
        });
        return result;
    }

});

