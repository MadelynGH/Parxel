"use client"
import { useState, useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import styles from "./tool.module.css";

const montserrat = Montserrat({
    weight: ["400"]
});

export default function Tool() {
    const DEFAULT_PIXEL_SIDE_LENGTH = 20;
    const [pixelSideLength, updatePixelSideLength] = useState(DEFAULT_PIXEL_SIDE_LENGTH);
    const [gridStatus, updateGridStatus] = useState(Array(20*20).fill("white"));
    const [paintColor, updatePaintColor] = useState("black");
    const [currentTool, updateCurrentTool] = useState("draw");
    const [isMouseDown, updateIsMouseDown] = useState(false);
    const [gridWidth, updateGridWidth] = useState(20);
    const [gridHeight, updateGridHeight] = useState(20);
    const [stage, updateStage] = useState(0);
    
    const fileInput = useRef(null);
    let svgRef = useRef(null);

    function Pixel({ coordinate }) {
        return (
            <div style={{
                backgroundColor: gridStatus[coordinate],
                width: pixelSideLength+"px",
                height: pixelSideLength+"px",
                border: "0.5px solid lightgray",
                boxSizing: "border-box"
            }} onPointerOver={() => {
                if (isMouseDown) {
                    let tempGridStatus = gridStatus.slice();
                    if (currentTool == "draw") {
                        tempGridStatus[coordinate] = paintColor;
                    } else if (currentTool == "erase") {
                        tempGridStatus[coordinate] = "white";
                    }
                    updateGridStatus(tempGridStatus);
                }
            }} onMouseDown={() => updateIsMouseDown(true)}></div>
        );
    }

    function IconRadioInput({ thingType, thingName, onClick, actionContent }) {
        if (thingType == "tool") {
            return (
                <input title={thingName} type="radio" name="tool" value={thingName} className={styles[thingName]} checked={currentTool == thingName} onChange={() => {
                    updateCurrentTool(thingName);
                }} style={{
                    border: currentTool == thingName ? "1px solid white" : "none"
                }} />
            );
        } else if (thingType == "action") {
            return (
                <button title={thingName} className={styles.actionButton} onClick={onClick}>{actionContent}</button>
            );
        }
    }

    return (
            <>
                <div style={{
                    paddingTop: "30px",
                    height: "100%"
                }} onMouseUp={() => updateIsMouseDown(false)}>
                    <h1 style={{
                        marginTop: 0
                    }}>Parxel: Pixel Art Creator</h1>
                    {stage == 0 ? 
                    [<div key={0}>
                        <h2>New Project:</h2>
                        <div>
                            <label htmlFor="gridWidth">Grid Width: </label>
                            <input className={montserrat.className} id="gridWidth" type="number" value={gridWidth} onChange={e => updateGridWidth(e.target.value)} />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="gridHeight">Grid Height: </label>
                            <input className={montserrat.className} id="gridHeight" type="number" value={gridHeight} onChange={e => updateGridHeight(e.target.value)} />
                        </div>
                        <br />
                        <button onClick={() => {
                            updateGridStatus(Array(gridWidth*gridHeight).fill("white"));
                            updateStage(1);
                        }} className={montserrat.className}>Continue</button>
                    </div>, <h3 key={1}>-- OR --</h3>,
                    <div key={2}>
                        <h2>Import .parxel file</h2>
                        <input type="file" ref={fileInput} style={{
                            marginBottom: "20px"
                        }} accept=".parxel" />
                        <br />
                        <button className={montserrat.className} onClick={() => {
                            if (fileInput.current.files[0]) {
                                const reader = new FileReader();

                                reader.addEventListener("load", () => {
                                    const info = JSON.parse(reader.result);
                                    updateGridWidth(info["gridWidth"]);
                                    updateGridHeight(info["gridHeight"]);
                                    updateGridStatus(info["gridStatus"]);
                                    updateStage(1);
                                });

                                reader.readAsText(new Blob([fileInput.current.files[0]], { type: "text" }));
                            } else {
                                alert("Please upload a file.");
                            }
                        }}>Continue</button>
                    </div>]
                    :
                        [<div style={{
                            display: "flex",
                            flexFlow: "column wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            marginTop: "40px",
                            yOverflow: "scroll",
                            xOverflow: "scroll"
                        }} key={1}>
                            <div>
                                <label htmlFor="paintColor">Paint Color:</label>
                                <input type="color" id="paintColor" value={paintColor} onChange={e => updatePaintColor(e.target.value)} />
                            
                                <div style={{
                                    width: DEFAULT_PIXEL_SIDE_LENGTH*gridWidth+"px",
                                    marginTop: "20px",
                                    display: "flex",
                                    flexFlow: "row wrap",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    border: "1px solid white",
                                    padding: "5px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        justifyContent: "center"
                                    }}>
                                        <IconRadioInput thingType="tool" thingName="draw" />
                                        <IconRadioInput thingType="tool" thingName="erase" />
                                    </div>
                                    
                                    <div style={{
                                        display: "flex",
                                        flexFlow: "row wrap",
                                        justifyContent: "center"
                                    }}>
                                        <IconRadioInput thingType="action" actionContent="⌕+" thingName="zoom in" onClick={() =>
                                            updatePixelSideLength(pixelSideLength + 10)
                                        } />
                                        <IconRadioInput thingType="action" actionContent="⌕-" thingName="zoom out" onClick={() =>
                                            updatePixelSideLength(pixelSideLength - 10)
                                        } />
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                flexFlow: "row wrap",
                                padding: "0",
                                width: pixelSideLength*gridWidth+"px",
                                height: pixelSideLength*gridHeight+"px"
                            }}>
                                {gridStatus.map((i, n) => <Pixel coordinate={n} key={n} />)}
                            </div>
                            <button onClick={() => {
                                const svgCode = svgRef.current.outerHTML;
                                const blob = new Blob([svgCode], { type: "image/svg-xml" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.setAttribute("download", "my_parxel_creation.svg");
                                a.setAttribute("href", url);
                                a.click();
                                a.remove();
                            }}>Download SVG</button>
                            <button onClick={() => {
                                const blob = new Blob([JSON.stringify({
                                    gridWidth: gridWidth,
                                    gridHeight: gridHeight,
                                    gridStatus: gridStatus
                                })], { type: "json/parxel" })
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.setAttribute("download", "my_parxel_creation.parxel");
                                a.setAttribute("href", url);
                                a.click();
                                a.remove();
                            }}>Download .parxel</button>
                        </div>]}

                        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width={pixelSideLength*gridWidth+"px"} height={pixelSideLength*gridHeight+"px"} style={{
                            display: "none",
                            border: "1px solid lightgray"
                        }}>
                            {gridStatus.map((color, i) =>
                                (<rect x={((i % gridWidth)*DEFAULT_PIXEL_SIDE_LENGTH)+"px"} y={
                                    i != 0 ? (Math.floor(i / gridWidth)*DEFAULT_PIXEL_SIDE_LENGTH)+"px" : "0px"
                                } width={DEFAULT_PIXEL_SIDE_LENGTH+"px"} height={DEFAULT_PIXEL_SIDE_LENGTH+"px"} key={i} style={{
                                    fill: color
                                }}  />)
                            )}
                        </svg>
                        <div style={{
                            marginTop: "20px"
                        }}>
                    </div>
                </div>
            </>
        );
}