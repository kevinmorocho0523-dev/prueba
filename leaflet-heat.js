<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">

    <meta
        http-equiv="X-UA-Compatible"
        content="IE=edge"
    >

    <meta
        name="viewport"
        content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width"
    >

    <meta
        name="mobile-web-app-capable"
        content="yes"
    >

    <meta
        name="apple-mobile-web-app-capable"
        content="yes"
    >

    <title>Mapa territorial de Buenavista</title>

    <link
        rel="stylesheet"
        href="css/leaflet.css"
    >

    <link
        rel="stylesheet"
        href="css/qgis2web.css"
    >

    <link
        rel="stylesheet"
        href="css/fontawesome-all.min.css"
    >

    <style>
        html,
        body,
        #map {
            height: 100%;
            margin: 0;
            min-height: 100%;
            overflow: hidden;
            padding: 0;
            width: 100%;
        }

        body,
        #map {
            background: #e7edf0;
        }

        /*
            Los controles externos ya existen en la
            página principal del GeoVisor.
        */

        .leaflet-control-zoom,
        .leaflet-control-locate,
        .leaflet-control-photon,
        .leaflet-control-search {
            display: none !important;
        }

        /*
            Control de capas.
        */

        .leaflet-control-layers {
            border:
                1px solid
                rgba(130, 206, 0, 0.55) !important;

            border-radius:
                10px !important;

            box-shadow:
                0 8px 24px
                rgba(33, 27, 45, 0.25) !important;
        }

        .leaflet-control-layers-expanded {
            max-height:
                calc(100vh - 40px) !important;

            overflow-x:
                hidden !important;

            overflow-y:
                auto !important;
        }

        .leaflet-control-layers-list,
        .leaflet-popup-content,
        .leaflet-tooltip {
            font-family:
                "Segoe UI",
                Arial,
                sans-serif;
        }

        .leaflet-control-layers-list {
            font-size: 12px;
        }

        /*
            Ventanas emergentes.
        */

        .leaflet-popup-content-wrapper {
            border-radius: 10px;
        }

        .leaflet-popup-content {
            max-height: 350px;
            min-width: 185px;
            overflow-y: auto;
        }

        .leaflet-control-attribution {
            background:
                rgba(255, 255, 255, 0.88) !important;

            font-size:
                8px !important;
        }

        /*
            Etiquetas al colocar el cursor.
        */

        .leaflet-tooltip {
            background:
                rgba(255, 255, 255, 0.94);

            border:
                1px solid
                rgba(48, 40, 63, 0.2);

            border-radius:
                6px;

            box-shadow:
                0 3px 10px
                rgba(33, 27, 45, 0.16);

            color:
                #30283f;

            font-size:
                10px;

            padding:
                4px 7px;
        }

        /*
            Tabla de información.
        */

        .popup-qgis table {
            border-collapse: collapse;
            width: 100%;
        }

        .popup-qgis th,
        .popup-qgis td {
            border-bottom:
                1px solid #e5e7e9;

            font-size:
                11px;

            padding:
                5px 4px;

            text-align:
                left;

            vertical-align:
                top;
        }

        .popup-qgis th {
            color:
                #30283f;

            width:
                42%;
        }

        .popup-qgis td {
            color:
                #596168;

            overflow-wrap:
                anywhere;
        }
    </style>
</head>

<body>

    <div id="map"></div>

    <!-- ==========================================
         LIBRERÍAS
    =========================================== -->

    <script src="js/leaflet.js"></script>
    <script src="js/leaflet-hash.js"></script>

    <!-- ==========================================
         DATOS DE LAS CAPAS
    =========================================== -->

    <script src="data/salud_buffer_1000_1.js"></script>

    <script src="data/Equipamento_buffer_500_2.js"></script>

    <script src="data/Lindero_3.js"></script>

    <script src="data/RED_VIAL_4.js"></script>

    <script src="data/Centroide_5.js"></script>

    <script src="data/Rio_Buenavista_6.js"></script>

    <script src="data/Puntos_meandros_7.js"></script>

    <script src="data/Riesgo_inundaciones_8.js"></script>

    <script src="data/parcelas_9.js"></script>

    <script src="data/Riesgos_inundaciones_buffer_100_10.js"></script>

    <script>
        "use strict";


        /* ==========================================
           CONFIGURACIÓN DEL MAPA
        =========================================== */

        var limitesIniciales = [
            [
                -3.3814973814997686,
                -79.87687195390014
            ],
            [
                -3.3267867606567636,
                -79.79501667999222
            ]
        ];


        var map = L.map(
            "map",
            {
                zoomControl: false,
                maxZoom: 28,
                minZoom: 1,
                preferCanvas: true
            }
        ).fitBounds(
            limitesIniciales
        );


        /*
            Dejamos disponibles Leaflet y el mapa
            para que el app.js principal pueda
            controlar zoom, búsqueda y centrado.
        */

        window.map = map;

        window.L = L;

        window.qgis2webMapReady = false;


        if (
            typeof L.Hash ===
            "function"
        ) {
            new L.Hash(map);
        }


        map.attributionControl.setPrefix(
            '<a href="https://github.com/qgis2web/qgis2web" ' +
            'target="_blank" rel="noopener">' +
            "qgis2web" +
            "</a>" +

            " &middot; " +

            '<a href="https://leafletjs.com" ' +
            'target="_blank" rel="noopener">' +
            "Leaflet" +
            "</a>" +

            " &middot; " +

            '<a href="https://qgis.org" ' +
            'target="_blank" rel="noopener">' +
            "QGIS" +
            "</a>"
        );


        /* ==========================================
           ESCAPAR TEXTO HTML
        =========================================== */

        function escaparHtml(valor) {
            return String(valor)
                .replace(
                    /&/g,
                    "&amp;"
                )
                .replace(
                    /</g,
                    "&lt;"
                )
                .replace(
                    />/g,
                    "&gt;"
                )
                .replace(
                    /"/g,
                    "&quot;"
                )
                .replace(
                    /'/g,
                    "&#039;"
                );
        }


        /* ==========================================
           CREAR CONTENIDO DE LOS POPUPS
        =========================================== */

        function crearPopup(
            propiedades,
            campos
        ) {
            var filas =
                campos
                    .filter(
                        function (campo) {
                            var valor =
                                propiedades[
                                    campo[0]
                                ];

                            return (
                                valor !== null &&
                                valor !== undefined &&
                                String(valor)
                                    .trim() !==
                                    ""
                            );
                        }
                    )
                    .map(
                        function (campo) {
                            return (
                                "<tr>" +

                                    "<th>" +
                                        escaparHtml(
                                            campo[1]
                                        ) +
                                    "</th>" +

                                    "<td>" +
                                        escaparHtml(
                                            propiedades[
                                                campo[0]
                                            ]
                                        ) +
                                    "</td>" +

                                "</tr>"
                            );
                        }
                    )
                    .join("");


            return (
                '<div class="popup-qgis">' +

                    "<table>" +

                        (
                            filas ||
                            "<tr>" +
                                "<td>" +
                                    "Sin información disponible" +
                                "</td>" +
                            "</tr>"
                        ) +

                    "</table>" +

                "</div>"
            );
        }


        /* ==========================================
           CREAR PANE
        =========================================== */

        function crearPane(
            nombre,
            zIndex
        ) {
            map.createPane(nombre);

            map.getPane(
                nombre
            ).style.zIndex =
                zIndex;

            map.getPane(
                nombre
            ).style.mixBlendMode =
                "normal";
        }


        /* ==========================================
           CREAR CAPA GEOJSON
        =========================================== */

        function crearCapa(
            configuracion
        ) {
            var capa = null;


            crearPane(
                configuracion.pane,
                configuracion.zIndex
            );


            capa = L.geoJSON(
                configuracion.datos,
                {
                    pane:
                        configuracion.pane,

                    interactive:
                        true,

                    style:
                        configuracion.estilo,

                    pointToLayer:
                        configuracion.punto,


                    onEachFeature:
                        function (
                            feature,
                            layer
                        ) {
                            /*
                                Ventana emergente.
                            */

                            layer.bindPopup(
                                crearPopup(
                                    feature.properties,
                                    configuracion.campos ||
                                    []
                                ),
                                {
                                    maxHeight:
                                        400
                                }
                            );


                            /*
                                Resaltar elementos.
                            */

                            layer.on({
                                mouseover:
                                    function (
                                        evento
                                    ) {
                                        var objetivo =
                                            evento.target;

                                        var tipo =
                                            objetivo
                                                .feature
                                                .geometry
                                                .type;


                                        objetivo.setStyle(
                                            (
                                                tipo ===
                                                "LineString" ||

                                                tipo ===
                                                "MultiLineString"
                                            )
                                                ? {
                                                    color:
                                                        "#ffe600",

                                                    weight:
                                                        Math.max(
                                                            3,

                                                            Number(
                                                                objetivo
                                                                    .options
                                                                    .weight ||
                                                                1
                                                            ) +
                                                            2
                                                        )
                                                }
                                                : {
                                                    fillColor:
                                                        "#ffe600",

                                                    fillOpacity:
                                                        0.85
                                                }
                                        );
                                    },


                                mouseout:
                                    function (
                                        evento
                                    ) {
                                        capa.resetStyle(
                                            evento.target
                                        );
                                    }
                            });


                            /*
                                Etiqueta no permanente.
                            */

                            if (
                                configuracion
                                    .tooltip
                            ) {
                                var texto =
                                    configuracion
                                        .tooltip(
                                            feature
                                        );


                                if (
                                    texto !== null &&
                                    texto !== undefined &&
                                    String(texto)
                                        .trim() !==
                                        ""
                                ) {
                                    layer.bindTooltip(
                                        String(texto)
                                            .trim(),
                                        {
                                            permanent:
                                                false,

                                            sticky:
                                                true,

                                            direction:
                                                "top",

                                            offset:
                                                [
                                                    0,
                                                    -10
                                                ]
                                        }
                                    );
                                }
                            }
                        }
                }
            );


            /*
                Variable global para conectarla
                con el app.js principal.
            */

            window[
                configuracion.nombre
            ] = capa;


            return capa;
        }


        /* ==========================================
           OPENSTREETMAP
        =========================================== */

        crearPane(
            "pane_OpenStreetMap_0",
            400
        );


        var layer_OpenStreetMap_0 =
            L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    pane:
                        "pane_OpenStreetMap_0",

                    opacity:
                        1,

                    attribution:
                        "&copy; OpenStreetMap",

                    minZoom:
                        1,

                    maxZoom:
                        28,

                    minNativeZoom:
                        0,

                    maxNativeZoom:
                        19
                }
            ).addTo(map);


        window.layer_OpenStreetMap_0 =
            layer_OpenStreetMap_0;


        /* ==========================================
           BUFFER DE SALUD
           APAGADO INICIALMENTE
        =========================================== */

        var layer_salud_buffer_1000_1 =
            crearCapa({
                nombre:
                    "layer_salud_buffer_1000_1",

                datos:
                    json_salud_buffer_1000_1,

                pane:
                    "pane_salud_buffer_1000_1",

                zIndex:
                    401,

                estilo:
                    function () {
                        return {
                            color:
                                "#987db7",

                            weight:
                                2,

                            dashArray:
                                "7 5",

                            fillColor:
                                "#987db7",

                            fillOpacity:
                                0.22
                        };
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ],
                    [
                        "id",
                        "ID"
                    ]
                ]
            });


        /* ==========================================
           BUFFER DE EQUIPAMIENTO
           APAGADO INICIALMENTE
        =========================================== */

        var layer_Equipamento_buffer_500_2 =
            crearCapa({
                nombre:
                    "layer_Equipamento_buffer_500_2",

                datos:
                    json_Equipamento_buffer_500_2,

                pane:
                    "pane_Equipamento_buffer_500_2",

                zIndex:
                    402,

                estilo:
                    function () {
                        return {
                            color:
                                "#91522d",

                            weight:
                                2,

                            dashArray:
                                "7 5",

                            fillColor:
                                "#ff9d32",

                            fillOpacity:
                                0.2
                        };
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ],
                    [
                        "id",
                        "ID"
                    ]
                ]
            });


        /* ==========================================
           LINDERO
        =========================================== */

        var layer_Lindero_3 =
            crearCapa({
                nombre:
                    "layer_Lindero_3",

                datos:
                    json_Lindero_3,

                pane:
                    "pane_Lindero_3",

                zIndex:
                    403,

                estilo:
                    function () {
                        return {
                            color:
                                "#111111",

                            weight:
                                4,

                            fillOpacity:
                                0
                        };
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ],
                    [
                        "id",
                        "ID"
                    ]
                ]
            }).addTo(map);


        /* ==========================================
           RED VIAL
        =========================================== */

        var layer_RED_VIAL_4 =
            crearCapa({
                nombre:
                    "layer_RED_VIAL_4",

                datos:
                    json_RED_VIAL_4,

                pane:
                    "pane_RED_VIAL_4",

                zIndex:
                    404,

                estilo:
                    function () {
                        return {
                            color:
                                "#729b6f",

                            weight:
                                5,

                            opacity:
                                1
                        };
                    },

                campos: [
                    [
                        "name",
                        "Nombre"
                    ],
                    [
                        "highway",
                        "Tipo de vía"
                    ],
                    [
                        "surface",
                        "Superficie"
                    ],
                    [
                        "maxspeed",
                        "Velocidad máxima"
                    ],
                    [
                        "lanes",
                        "Carriles"
                    ],
                    [
                        "oneway",
                        "Unidireccional"
                    ]
                ],

                tooltip:
                    function (
                        feature
                    ) {
                        return (
                            feature
                                .properties
                                .name
                        );
                    }
            }).addTo(map);


        /* ==========================================
           CENTROIDE
           APAGADO INICIALMENTE
        =========================================== */

        var layer_Centroide_5 =
            crearCapa({
                nombre:
                    "layer_Centroide_5",

                datos:
                    json_Centroide_5,

                pane:
                    "pane_Centroide_5",

                zIndex:
                    405,

                punto:
                    function (
                        feature,
                        latlng
                    ) {
                        return L.circleMarker(
                            latlng,
                            {
                                pane:
                                    "pane_Centroide_5",

                                radius:
                                    8,

                                color:
                                    "#30283f",

                                weight:
                                    2,

                                fillColor:
                                    "#d5b43c",

                                fillOpacity:
                                    1
                            }
                        );
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ],
                    [
                        "id",
                        "ID"
                    ]
                ]
            });


        /* ==========================================
           RÍO BUENAVISTA
        =========================================== */

        var layer_Rio_Buenavista_6 =
            crearCapa({
                nombre:
                    "layer_Rio_Buenavista_6",

                datos:
                    json_Rio_Buenavista_6,

                pane:
                    "pane_Rio_Buenavista_6",

                zIndex:
                    406,

                estilo:
                    function () {
                        return {
                            color:
                                "#18a8dc",

                            weight:
                                4,

                            opacity:
                                0.95
                        };
                    },

                campos: [
                    [
                        "name",
                        "Nombre"
                    ],
                    [
                        "waterway",
                        "Tipo"
                    ],
                    [
                        "osm_id",
                        "OSM ID"
                    ]
                ],

                tooltip:
                    function (
                        feature
                    ) {
                        return (
                            feature
                                .properties
                                .name ||

                            "Río Buenavista"
                        );
                    }
            }).addTo(map);


        /* ==========================================
           PUNTOS DE MEANDROS
           APAGADOS INICIALMENTE
        =========================================== */

        var layer_Puntos_meandros_7 =
            crearCapa({
                nombre:
                    "layer_Puntos_meandros_7",

                datos:
                    json_Puntos_meandros_7,

                pane:
                    "pane_Puntos_meandros_7",

                zIndex:
                    407,

                punto:
                    function (
                        feature,
                        latlng
                    ) {
                        return L.circleMarker(
                            latlng,
                            {
                                pane:
                                    "pane_Puntos_meandros_7",

                                radius:
                                    5,

                                color:
                                    "#30283f",

                                weight:
                                    1,

                                fillColor:
                                    "#beb297",

                                fillOpacity:
                                    1
                            }
                        );
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ]
                ]
            });


        /* ==========================================
           RIESGO DE INUNDACIÓN
        =========================================== */

        var layer_Riesgo_inundaciones_8 =
            crearCapa({
                nombre:
                    "layer_Riesgo_inundaciones_8",

                datos:
                    json_Riesgo_inundaciones_8,

                pane:
                    "pane_Riesgo_inundaciones_8",

                zIndex:
                    408,

                estilo:
                    function () {
                        return {
                            color:
                                "#4d5960",

                            weight:
                                1.5,

                            fillColor:
                                "#7d8b8f",

                            fillOpacity:
                                0.55
                        };
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ]
                ]
            }).addTo(map);


        /* ==========================================
           COLORES DE LAS PARCELAS
        =========================================== */

        function estiloParcela(
            feature
        ) {
            var categoria =
                String(
                    feature
                        .properties
                        .layer ||
                    ""
                ).trim();


            var colores = {
                areas_verdes:
                    "#b263ce",

                Suelo_vacante:
                    "#7584e6",

                comercial:
                    "#c7e288",

                Educacion:
                    "#66cacc",

                residencia:
                    "#52ec69",

                Salud:
                    "#f01b70"
            };


            return {
                color:
                    "#232323",

                weight:
                    1.2,

                fillColor:
                    colores[
                        categoria
                    ] ||
                    "#d1986a",

                fillOpacity:
                    0.9
            };
        }


        /* ==========================================
           PARCELAS
        =========================================== */

        var layer_parcelas_9 =
            crearCapa({
                nombre:
                    "layer_parcelas_9",

                datos:
                    json_parcelas_9,

                pane:
                    "pane_parcelas_9",

                zIndex:
                    409,

                estilo:
                    estiloParcela,

                campos: [
                    [
                        "id",
                        "ID"
                    ],
                    [
                        "area_m2",
                        "Área (m²)"
                    ],
                    [
                        "layer",
                        "Uso del suelo"
                    ]
                ],

                tooltip:
                    function (
                        feature
                    ) {
                        return String(
                            feature
                                .properties
                                .layer ||
                            ""
                        ).trim();
                    }
            }).addTo(map);


        /* ==========================================
           BUFFER DE INUNDACIÓN
           APAGADO INICIALMENTE
        =========================================== */

        var layer_Riesgos_inundaciones_buffer_100_10 =
            crearCapa({
                nombre:
                    "layer_Riesgos_inundaciones_buffer_100_10",

                datos:
                    json_Riesgos_inundaciones_buffer_100_10,

                pane:
                    "pane_Riesgos_inundaciones_buffer_100_10",

                zIndex:
                    410,

                estilo:
                    function () {
                        return {
                            color:
                                "#377eb8",

                            weight:
                                2,

                            dashArray:
                                "7 5",

                            fillOpacity:
                                0
                        };
                    },

                campos: [
                    [
                        "fid",
                        "FID"
                    ]
                ]
            });


        /* ==========================================
           MAPAS BASE
        =========================================== */

        var mapasBase = {
            OpenStreetMap:
                layer_OpenStreetMap_0
        };


        /* ==========================================
           CAPAS DEL CONTROL
        =========================================== */

        var capasSuperpuestas = {
            '<img src="legend/Lindero_3.png" alt=""> Lindero':
                layer_Lindero_3,


            '<img src="legend/RED_VIAL_4.png" alt=""> Red vial':
                layer_RED_VIAL_4,


            '<img src="legend/Rio_Buenavista_6.png" alt=""> Río Buenavista':
                layer_Rio_Buenavista_6,


            '<img src="legend/Riesgo_inundaciones_8.png" alt=""> Riesgo de inundación':
                layer_Riesgo_inundaciones_8,


            "Parcelas por uso del suelo":
                layer_parcelas_9,


            '<img src="legend/Puntos_meandros_7.png" alt=""> Puntos de meandros':
                layer_Puntos_meandros_7,


            '<img src="legend/Centroide_5.png" alt=""> Centroide':
                layer_Centroide_5,


            '<img src="legend/Equipamento_buffer_500_2.png" alt=""> Buffer de equipamiento (500 m)':
                layer_Equipamento_buffer_500_2,


            '<img src="legend/salud_buffer_1000_1.png" alt=""> Buffer de salud (1.000 m)':
                layer_salud_buffer_1000_1,


            '<img src="legend/Riesgos_inundaciones_buffer_100_10.png" alt=""> Buffer de inundación (100 m)':
                layer_Riesgos_inundaciones_buffer_100_10
        };


        /*
            Agregar control de capas.
        */

        L.control.layers(
            mapasBase,
            capasSuperpuestas,
            {
                collapsed:
                    true,

                position:
                    "topright"
            }
        ).addTo(map);


        /* ==========================================
           AJUSTAR EL MAPA AL IFRAME
        =========================================== */

        function ajustarMapaAlContenedor() {
            map.invalidateSize({
                animate:
                    false,

                pan:
                    false
            });
        }


        /*
            Avisar que el mapa ya está preparado.
        */

        map.whenReady(
            function () {
                ajustarMapaAlContenedor();


                window.qgis2webMapReady =
                    true;


                document.body.setAttribute(
                    "data-qgis2web-ready",
                    "true"
                );
            }
        );


        /*
            Ajustar al terminar la carga.
        */

        window.addEventListener(
            "load",
            function () {
                ajustarMapaAlContenedor();


                setTimeout(
                    ajustarMapaAlContenedor,
                    150
                );


                setTimeout(
                    ajustarMapaAlContenedor,
                    500
                );
            }
        );


        /*
            Ajustar al cambiar el tamaño.
        */

        var temporizadorAjusteMapa =
            null;


        window.addEventListener(
            "resize",
            function () {
                clearTimeout(
                    temporizadorAjusteMapa
                );


                temporizadorAjusteMapa =
                    setTimeout(
                        ajustarMapaAlContenedor,
                        120
                    );
            }
        );


        /*
            Permitir que el app.js principal
            solicite un reajuste.
        */

        window.addEventListener(
            "message",
            function (evento) {
                if (
                    evento.data ===
                    "ajustar-mapa-qgis2web"
                ) {
                    ajustarMapaAlContenedor();
                }
            }
        );
    </script>
</body>
</html>