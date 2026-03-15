const simplemaps_countrymap_mapdata = {
  main_settings: {
   //General settings
    width: "responsive", //'700' or 'responsive'
    background_color: "#FFFFFF",
    background_transparent: "yes",
    border_color: "#ffffff",
    
    //State defaults
    state_description: "State description",
    state_color: "#88A4BC",
    state_hover_color: "#3B729F",
    state_url: "",
    border_size: 1.5,
    all_states_inactive: "no",
    all_states_zoomable: "yes",
    
    //Location defaults
    location_description: "Location description",
    location_url: "",
    location_color: "#ff0000",
    location_opacity: 0.8,
    location_hover_opacity: 1,
    location_size: "80",
    location_type: "marker",
    location_image_source: "frog.png",
    location_border_color: "#FFFFFF",
    location_border: 2,
    location_hover_border: 2.5,
    all_locations_inactive: "no",
    all_locations_hidden: "no",
    
    //Label defaults
    label_color: "#ffffff",
    label_hover_color: "#ffffff",
    label_size: 16,
    label_font: "Arial",
    label_display: "auto",
    label_scale: "yes",
    hide_labels: "no",
    hide_eastern_labels: "no",
   
    //Zoom settings
    zoom: "yes",
    manual_zoom: "yes",
    back_image: "no",
    initial_back: "no",
    initial_zoom: "-1",
    initial_zoom_solo: "no",
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,
    
    //Popup settings
    popup_color: "white",
    popup_opacity: 0.9,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
    popup_nocss: "no",
    
    //Advanced settings
    div: "map",
    auto_load: "yes",
    url_new_tab: "no",
    images_directory: "default",
    fade_time: 0.1,
    link_text: "View Website",
    popups: "detect",
    state_image_url: "",
    state_image_position: "",
    location_image_url: ""
  },
  state_specific: {
    PKBA: {
      name: "Baluchistan",
      color: "#ff9a00"
    },
    PKGB: {
      name: "Northern Areas",
      color: "#20c4d8"
    },
    PKIS: {
      name: "F.C.T.",
      color: "#95cd60"
    },
    PKJK: {
      name: "Azad Kashmir",
      color: "#60cdb4"
    },
    PKKP: {
      name: "K.P.",
      color: "#eeef20"
    },
    PKPB: {
      name: "Punjab",
      color: "#3edc39"
    },
    PKSD: {
      name: "Sind",
      color: "#3964dc"
    }
  },
  locations: {
    "0": {
      name: "Islamabad",
      lat: "33.633399",
      lng: "73.0247758",
      description: "JMC Rawalpindi Motors",
      url: "https://maps.app.goo.gl/NT3GEnHYqkkmtkA68"
    },
    "1": {
      name: "Lahore",
      lat: "31.4363534",
      lng: "74.1855552",
      description: "Al-Nasir Motors Lahore",
      url: "https://maps.app.goo.gl/K8L8Q2zP6Ve5vEwv8"
    },
    "2": {
      lat: "31.4511014",
      lng: "73.1467576",
      name: "Faisalabad",
      description: "Al-Nasir Motors Faisalabad",
      url: "https://maps.app.goo.gl/sJv38gAsLGThyedL9"
    },
    "3": {
      lat: "30.2151262",
      lng: "71.5247099",
      name: "Multan",
      description: "Abdullah Motors Multan",
      color: "#ff0000",
      url: "https://maps.app.goo.gl/RLKge4NMvxpg6GvL9"
    },
    "4": {
      lat: "24.880096",
      lng: "67.0112941",
      color: "#ff0000",
      name: "Karachi",
      description: "Car Club Karachi",
      url: "https://maps.app.goo.gl/xoopt9oHLrn7JLpw9"
    }
  },
  labels: {
    "0": {
      name: "Islamabad",
      x: "728.85",
      y: "278.93",
      parent_type: "location",
      parent_id: "0"
    },
    "1": {
      name: "Lahore",
      x: "793.98",
      y: "425.17",
      parent_type: "location",
      parent_id: "1"
    },
    PKBA: {
      name: "Baluchistan",
      parent_id: "PKBA"
    },
    PKGB: {
      name: "Northern Areas",
      parent_id: "PKGB"
    },
    PKIS: {
      name: "F.C.T.",
      parent_id: "PKIS"
    },
    PKJK: {
      name: "Azad Kashmir",
      parent_id: "PKJK"
    },
    PKKP: {
      name: "K.P.",
      parent_id: "PKKP"
    },
    PKPB: {
      name: "Punjab",
      parent_id: "PKPB"
    },
    PKSD: {
      name: "Sind",
      parent_id: "PKSD"
    }
  },
  legend: {
    entries: []
  },
  regions: {},
  data: {
    data: {}
  }
};

export default simplemaps_countrymap_mapdata;
export { simplemaps_countrymap_mapdata };