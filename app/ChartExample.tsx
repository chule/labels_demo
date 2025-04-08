"use client";
import { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  SciChartJsNavyTheme,
  NumberRange,
  FastRectangleRenderableSeries,
  EColumnMode,
  EColumnYMode,
  EDataPointWidthMode,
  EResamplingMode,
  XyxyDataSeries,
  EColumnDataLabelPosition,
  EHorizontalTextPosition,
  EVerticalTextPosition,
} from "scichart";

type MetadataType = {
  label: string;
  isSelected: boolean;
};

// An example of WASM dependencies URLs configuration to fetch from origin server:
SciChartSurface.configure({
  wasmUrl: "scichart2d.wasm",
  dataUrl: "scichart2d.data",
});

async function initSciChart(rootElement: string | HTMLDivElement) {
  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  // Create an XAxis and YAxis with growBy padding
  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "X Axis", growBy })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, { axisTitle: "Y Axis", growBy })
  );

  const xValues = [0, 5, 10, 40];
  const yValues = [10, 30, 40, 45];
  const x1Values = [5, 15, 30, 60];
  const y1Values = [5, 10, 10, 20];
  const metadata = [
    { label: "one", isSelected: false },
    { label: "two", isSelected: false },
    { label: "three", isSelected: false },
    { label: "four", isSelected: false },
  ];

  console.log({ metadata });

  //FastRectangleRenderableSeries
  const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues,
      yValues,
      x1Values,
      y1Values,
      metadata,
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.CenterHeight,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "white",
    strokeThickness: 3,
    fill: "#00ff0077",
    // opacity: 0.5,
    defaultY1: 0,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 5,
    bottomCornerRadius: 5,
    dataLabels: {
      horizontalTextPosition: EHorizontalTextPosition.Right,
      verticalTextPosition: EVerticalTextPosition.Above,
      positionMode: EColumnDataLabelPosition.Inside,
      style: {
        fontSize: 16,
      },
      color: "#EEE",
      metaDataSelector: (md) => {
        const metadata = md as MetadataType;
        return metadata.label;
      },
    },
  });

  sciChartSurface.renderableSeries.add(rectangleSeries);

  return { sciChartSurface };
}

export default function Home() {
  const rootElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPromise = initSciChart(rootElementRef.current as HTMLDivElement);

    return () => {
      initPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, []);

  return <div ref={rootElementRef} style={{ width: 900, height: 600 }}></div>;
}
