import React, { useEffect } from "react";
import { useStore } from "../../../stores";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react";
import { Grid, makeStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import DashboardFilter from '../Component/DashboardFilter';
import Chart95 from "../charts/Chart95";
import ChartHIV from "../charts/ChartHIV";
import DashboardMap from "../map/DashboardMap";
import DashboardTable from '../Component/DashboardTable';
import NoticeCard from "../Component/NoticeCard";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { mapData } from "../../../../constant";
import drilldow from "highcharts/modules/drilldown";
import dataModule from "highcharts/modules/data";
import { districs } from "../../../../districts";

const useStyles = makeStyles((theme) => ({
    root: {
        top: "10px",
    },
    card: {
        background: "#ffffff",
        padding: "1.25rem",
    },
    cardBody: {
        display: "flex",
        minHeight: "1px",
    },
    cardInfo: {
        marginLeft: "auto",
        fontSize: "30px",
    },
    cardDevider: {
        height: "6px",
        borderRadius: "0.25rem",
    },
    cardTotal: {
        height: "100%",
        border: "none",
        borderRadius: "0px",
    },
}));

export default observer(function DashboardTotalAdminView() {
    const { dashboardTotalStore } = useStore();

    const classes = useStyles();

    const { t, i18n } = useTranslation();

    let lang = {
        downloadPNG: t("feature.download_png"),
        viewFullscreen: t("feature.full_screen"),
        printChart: t("feature.print_chart"),
        downloadJPEG: t("feature.download_jpeg"),
        downloadPDF: t("feature.download_pdf"),
        downloadSVG: t("feature.download_svg"),
        contextButtonTitle: t("feature.feature"),
        noData: t("feature.noData"),
        exitFullscreen: t("feature.exitFullscreen")
    }

    const {
        searObj,
        series95,
        series95En,
        seriesHiv,
        seriesHivEn,
        listYear,
        chartHIVyAxis,
        chartHIVyAxisEn,
        isProvince,
        dataMap,
        typeMap,
        handleFilters,
        listProvince,
        district,
        warningNewFound,
        warningnewlyinfected,
        warningList,
        warningNewFoundEn,
        warningnewlyinfectedEn,
        warningListEn,
        userAdmini
    } = dashboardTotalStore;

    // useEffect(() => {
    //     let admini = localStorageService.getItem("auth_user").administrativeUnit;
    //     console.log(admini)
    //     console.log(isProvince)
    //     // setFieldValue("province", admini)
    // }, [isProvince]);

    const columnsProvince = [
        { title: t("population.district"), field: "district" },
        { title: t("population.percent"), field: "percent" }
    ];

    const columnsDistrict = [
        { title: t("population.province"), field: "province" },
        { title: t("population.percent"), field: "percent" }
    ]

    const categories95 = [
        "<strong style='font-family: Roboto;'>Ước tính nhiễm HIV</strong>",
        "<strong style='font-family: Roboto;'>Biết tình trạng HIV của mình</strong>",
        "<strong style='font-family: Roboto;'>Đang điều trị ARV</strong>",
        "<strong>TLVR được ức chế</strong>"
    ]

    const categories95En = [
        "<strong style='font-family: Roboto;'>Estimated PLHIV</strong>",
        "<strong style='font-family: Roboto;'>PLHIV</strong>",
        "<strong style='font-family: Roboto;'>On ART</strong>",
        "<strong>Supppressed VL</strong>"
    ]

    let currentlevel = 0;
    let mapKeyLv1 = "";
    let mapKeyLv2 = "";
    const colorChart = [
        "#fef5f1",
        "#fccbb7",
        "#fb8e6e",
        "#f34c36",
        "#c4151a",
        "#66000c",
    ];
    function filterDis(obj) {
        if (obj.properties.GID_1 === mapKeyLv1) return obj;
    }

    function filterComm(obj) {
        if (obj.properties.GID_2 === mapKeyLv2) return obj;
    }

    let maxData = 1;

    let data = mapData.vi_all.features;
    data.forEach((d, i) => {
        d.drilldown = d.properties["GID_1"];
        d.name = d.properties.NAME_1; // Non-random bogus data
        d.CaMac = Math.floor(Math.random() * 100);
        d.PF = Math.floor(Math.random() * 100);
        d.PV = Math.floor(Math.random() * 100);
        d.PH = Math.floor(Math.random() * 100);
        d.Other = Math.floor(Math.random() * 100);

        d.value = d.CaMac;
        if(maxData < d.CaMac) {
            maxData = d.CaMac;
        }
    });
    const mapOptions = {
        chart: {
            style: {
                fontFamily: "Arial, Helvetica, Clean, sans-serif",
            },
            events: {
                drilldown: function (e) {
                    debugger
                    this.zoomOut();
                    if (!e.seriesOptions) {
                        const chart = this,
                            mapKey = e.point.drilldown;

                        let fail = setTimeout(() => {
                            if (!Highcharts.maps[mapKey]) {
                                chart.showLoading();
                                fail = setTimeout(() => {
                                    chart.hideLoading();
                                }, 1000);
                            }
                        }, 3000);
                        if (currentlevel === 0) {
                            data = mapData.VNM_all.features;
                            mapKeyLv1 = mapKey;
                            data = data.filter(filterDis);
                            // Set a non-random bogus value
                            data.forEach((d, i) => {
                                d.name = d.properties.NAME_2;
                                d.drilldown = d.properties["GID_2"];
                                d.CaMac = Math.floor(Math.random() * 100);
                                d.PF = Math.floor(Math.random() * 100);
                                d.PV = Math.floor(Math.random() * 100);
                                d.PH = Math.floor(Math.random() * 100);
                                d.Other = Math.floor(Math.random() * 100);

                                d.value = d.CaMac;
                            });
                            // Hide loading and add series
                            chart.hideLoading();
                            clearTimeout(fail);
                            chart.addSeriesAsDrilldown(e.point, {
                                name: e.point.properties.NAME_1,
                                data: data,
                                dataLabels: {
                                    enabled: true,
                                    format: "{point.name}",
                                },
                            });

                            currentlevel++;
                            this.setTitle(null, { text: e.point.properties?.NAME_1 });
                        } else {
                            data = districs[mapKeyLv1.replaceAll('.','_')].features;
                            mapKeyLv2 = mapKey;
                            data = data.filter(filterComm);
                            // Set a non-random bogus value
                            data.forEach((d, i) => {
                                d.name = d.properties.NAME_3;
                                d.CaMac = Math.floor(Math.random() * 100);
                                d.PF = Math.floor(Math.random() * 100);
                                d.PV = Math.floor(Math.random() * 100);
                                d.PH = Math.floor(Math.random() * 100);
                                d.Other = Math.floor(Math.random() * 100);

                                d.value = d.CaMac;
                            });

                            // Hide loading and add series
                            chart.hideLoading();
                            clearTimeout(fail);

                            chart.addSeriesAsDrilldown(e.point, {
                                name: e.point.properties.NAME_1,
                                data: data,
                                dataLabels: {
                                    enabled: true,
                                    format: "{point.name}",
                                },
                            });
                            this.mapView.zoom = 10;
                            currentlevel++;
                            this.setTitle(null, { text: e.point.properties?.NAME_2 });
                        }
                    }
                },

                drillup: function (e) {
                    if (e.seriesOptions.custom && e.seriesOptions.custom.mapView) {
                        e.target.mapView.update(e.seriesOptions.custom.mapView, false);
                    }
                    this.zoomOut();
                    this.setTitle(null, { text: "" });
                    currentlevel--;
                },
            },
        },

        title: {
            text: "THB sốt rét",
        },

        legend: {
            layout: "vertical",
            align: "left",
        },

        colorAxis: {
            min: 0,
            minColor: colorChart[0],
            maxColor: colorChart[5],
            stops: [
                [0, colorChart[0]],
                [0.2, colorChart[1]],
                [0.4, colorChart[2]],
                [0.6, colorChart[3]],
                [0.8, colorChart[4]],
                [1, colorChart[5]],
            ],
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                align: "right",
                verticalAlign: "bottom",
            },
            enableMouseWheelZoom: true,
            enableDoubleClickZoomTo: true,
        },

        plotOptions: {
            map: {
                states: {
                    hover: {
                        color: "#EEDD66",
                        borderColor: "black",
                    },
                },
                borderColor: "#737375",
            },
        },

        tooltip: {
            formatter: function () {
                return (
                    (currentlevel === 0
                        ? "<b>" + this.point.properties.NAME_1 + "</b><br>"
                        : "") +
                    (currentlevel === 1
                        ? "<b>" + this.point.properties.NAME_2 + "</b><br>"
                        : "") +
                    (currentlevel === 2
                        ? "<b>" + this.point.properties.NAME_3 + "</b><br>"
                        : "") +
                    "P.f: <b>" +
                    this.point.PF +
                    "</b><br>" +
                    "P.v: <b>" +
                    this.point.PV +
                    "</b><br>" +
                    "Phối hợp: <b>" +
                    this.point.PH +
                    "</b><br>" +
                    "Khác: <b>" +
                    this.point.Other +
                    "</b>"
                );
            },
        },

        series: [
            {
                type: "map",
                data: data,
                name: "Việt Nam",
                dataLabels: {
                    enabled: true,
                    format: "{point.properties.NAME_1}",
                    allowOverlap: false,
                    padding: 0,
                },
            },
        ],

        drilldown: {
            activeDataLabelStyle: {
                color: "#000",
                textDecoration: "none",
                textOutline: "1px #fff",
                fontWeight: "normal",
            },
            drillUpButton: {
                relativeTo: "spacingBox",
                position: {
                    x: 0,
                    y: 60,
                },
            },
            series: [
                {
                    data: data,
                    name: "Việt Nam",
                    dataLabels: {
                        enabled: true,
                        format: "{point.properties.NAME_1}",
                        allowOverlap: false,
                        padding: 0,
                    },
                },
            ],
        },
    };
    drilldow(Highcharts);
    dataModule(Highcharts);
    require("highcharts/modules/map")(Highcharts);

    useEffect(() => {
        console.log(i18n.language);
    }, [i18n.language]);

    return (
        <>
            <Grid item xs={12}>
                <Formik
                    initialValues={searObj}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form autoComplete="off">
                            <DashboardFilter
                                handleFilters={handleFilters}
                                listProvince={listProvince}
                                district={district}
                                isProvince={isProvince}
                                userAdmini={userAdmini}
                                isFilterYear
                            />
                        </Form>
                    )}
                </Formik>
            </Grid>
            <Grid item xs={12}>
                <HighchartsReact
                    options={mapOptions}
                    highcharts={Highcharts}
                    constructorType={"mapChart"}
                />
            </Grid>
            <Grid item md={8} xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {i18n.language === "vi" &&
                            <Chart95
                                title={t("card.95")}
                                lang={lang}
                                item={series95}
                                categories={categories95}
                                yAxisTitle="Số ca"
                            />}
                        {i18n.language === "en" &&
                            <Chart95
                                title={t("card.95")}
                                lang={lang}
                                item={series95En}
                                categories={categories95En}
                                yAxisTitle="Cases"
                            />}
                    </Grid>
                    <Grid item xs={12}>
                        {i18n.language === "vi" &&
                            <ChartHIV
                                title={t("card.chart")}
                                lang={lang}
                                series={seriesHiv}
                                categories={listYear}
                                yAxis={chartHIVyAxis}
                            />}
                        {i18n.language === "en" &&
                            <ChartHIV
                                title={t("card.chart")}
                                lang={lang}
                                series={seriesHivEn}
                                categories={listYear}
                                yAxis={chartHIVyAxisEn}
                            />}
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <NoticeCard
                            title={t("card.warningNewFound")}
                            iconColor="red"
                            list={i18n.language === "vi" ? warningNewFound : warningNewFoundEn}
                        />
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <NoticeCard
                            title={t("card.warningnewlyinfected")}
                            iconColor="orange"
                            list={i18n.language === "vi" ? warningnewlyinfected : warningnewlyinfectedEn} />
                    </Grid>
                    <Grid item md={4} sm={12} xs={12}>
                        <NoticeCard
                            title={t("card.warningList")}
                            iconColor="purple"
                            list={i18n.language === "vi" ? warningList : warningListEn} />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item md={4} xs={12}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {i18n.language === "vi" &&
                            <DashboardMap
                                title={t("card.map")}
                                // containerProps={{ style: { width: '100%', height: '425px' } }}
                                // height="425px"
                                lang={lang}
                                data={dataMap}
                                id={typeMap}
                                percent={true}
                            />
                        }
                        {i18n.language === "en" &&
                            <DashboardMap
                                title={t("card.map")}
                                lang={lang}
                                data={dataMap}
                                id={typeMap}
                                percent={true}
                            />
                        }

                    </Grid>
                    <Grid item xs={12}>
                        {dataMap && dataMap.reportListMap && ((searObj?.province || isProvince) ?
                            <DashboardTable
                                titleCard={t("card.ratio")}
                                data={dataMap.reportListMap}
                                columns={columnsProvince}
                            /> : <DashboardTable
                                titleCard={t("card.ratio")}
                                data={dataMap.reportListMap}
                                columns={columnsDistrict}

                            />)
                        }
                        {/* {dataMap && dataMap.reportListMap && searObj?.district && 
                            <DashboardTable
                                data={dataMap.reportListMap}
                                columns = {columnsDistrict}

                            />
                        } */}
                    </Grid>
                </Grid>
            </Grid>
        </>


    );
});
