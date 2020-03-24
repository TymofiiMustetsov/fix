var selectedZipCodes = [];
$(document).ready(function() {

  let fullData;
  jQuery.get("/data/geo_data.json", function (data) {
    /*console.log(JSON.parse(data));*/
    fullData = JSON.parse(data);

    const newData = [];
    for (let i of fullData.state) {
      i = {
        id: 'state' + i.id,
        parent: '#',
        text: i.name,
        icon: "/img/state-icon.png",
        state: {
          "opened": false
        }
      };
      newData.push(i);
    }
    for (let i of fullData.county) {
      i = {
        id: 'county' + i.id,
        parent: 'state' + i.state_id,
        text: i.name,
        icon: "/img/state-icon.png",
        state: {
          "opened": false
        }
      }
        newData.push(i);
    }
    for (let i of fullData.city) {
      i = {
        id: 'city' + i.id,
        parent: 'county' + i.county_id,
        text: i.name,
        state: {
          "opened": false
        }
      }
      newData.push(i);
    }

    for (let i of fullData.zipcode) {

      i = {
        id: +i.id,
        parent: 'city' + i.city_id,
        text: i.zipcode,
        icon: "/img/telephone-gray.svg"
      }

      if (zipsIdsSelected.indexOf(i.id) !== -1) {
        i.state = {
          "selected": true, "opened": false
        };
      }

      newData.push(i);
    }


    $('#jstree_div')
      .jstree(
      {
        'core': {
          'data': newData,
          /*"themes" : {
            "variant" : "large"
          }*/
        },
        "plugins" : [ "wholerow", "checkbox" ]
      }
      );
  });
});

