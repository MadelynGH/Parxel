"use client"
import { useState, useEffect } from "react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
    weight: ["400"]
});

export default function Tool() {
    const PIXEL_SIDE_LENGTH = 20;
    const [gridStatus, updateGridStatus] = useState(Array(20*20).fill("white"));
    const [paintColor, updatePaintColor] = useState("black");
    const [isMouseDown, updateIsMouseDown] = useState(false);
    const [gridWidth, updateGridWidth] = useState(20);
    const [gridHeight, updateGridHeight] = useState(20);
    const [stage, updateStage] = useState(0);

    function Pixel({ coordinate }) {
        return (
            <div style={{
                backgroundColor: gridStatus[coordinate],
                width: PIXEL_SIDE_LENGTH+"px",
                height: PIXEL_SIDE_LENGTH+"px",
                border: "0.5px solid lightgray",
                boxSizing: "border-box"
            }} onPointerOver={() => {
                if (isMouseDown) {
                    let tempGridStatus = gridStatus.slice();
                    tempGridStatus[coordinate] = paintColor;
                    updateGridStatus(tempGridStatus);
                }
            }} onMouseDown={() => updateIsMouseDown(true)}></div>
        );
    }

    return (
            <>
                <div style={{
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    left: "0",
                    top: "0",
                    zIndex: "1"
                }} onMouseUp={() => updateIsMouseDown(false)}>
                    <h1>Parxel: Pixel Art Creator</h1>
                    {stage == 0 ? 
                    [<div key={0}>
                        <h2>Dimensions:</h2>
                        <div>
                            <label htmlFor="gridWidth">Width: </label>
                            <input className={montserrat.className} id="gridWidth" type="number" value={gridWidth} onChange={e => updateGridWidth(e.target.value)} />
                        </div>
                        <br />
                        <div>
                            <label htmlFor="gridHeight">Height: </label>
                            <input className={montserrat.className} id="gridHeight" type="number" value={gridHeight} onChange={e => updateGridHeight(e.target.value)} />
                        </div>
                        <br />
                        <button onClick={() => {
                            updateGridStatus(Array(gridWidth*gridHeight).fill("white"));
                            updateStage(1);
                        }}>Continue</button>
                    </div>]
                    :
                        [<div style={{
                            display: "flex",
                            flexFlow: "column wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            marginTop: "40px"
                        }} key={1}>
                            <div>
                                <label htmlFor="paintColor">Paint Color:</label>
                                <input type="color" id="paintColor" value={paintColor} onChange={e => updatePaintColor(e.target.value)} />
                            </div>
                            <div style={{
                                display: "flex",
                                flexFlow: "row wrap",
                                padding: "0",
                                width: PIXEL_SIDE_LENGTH*gridWidth+"px",
                                height: PIXEL_SIDE_LENGTH*gridHeight+"px",
                                // marginLeft: "auto",
                                // marginRight: "auto",
                            }}>
                                {gridStatus.map((i, n) => <Pixel coordinate={n} key={n} />)}
                            </div>
                        </div>]}
                </div>
            </>
        );
}