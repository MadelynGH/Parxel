"use client"
import { useState, useEffect } from "react";

export default function Tool({ GRID_WIDTH, GRID_HEIGHT }) {
    const PIXEL_SIDE_LENGTH = 20;
    const [gridStatus, updateGridStatus] = useState(Array(20*20).fill("white"));
    const [paintColor, updatePaintColor] = useState("black");
    const [isMouseDown, updateIsMouseDown] = useState(false);
    const [stage, updateStage] = useState(0);

    function Pixel({ coordinate }) {
        return (
            <div style={{
                backgroundColor: gridStatus[coordinate],
                width: PIXEL_SIDE_LENGTH+"px",
                height: PIXEL_SIDE_LENGTH+"px",
                border: "1px solid lightgray",
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
                {
                    <div style={{
                        width: "100vw",
                        height: "100vh",
                        position: "fixed",
                        left: "0",
                        top: "0",
                        zIndex: "1"
                    }} onMouseUp={() => updateIsMouseDown(false)}>
                        <h1>Parxel: Pixel Art Creator</h1>
                        <div style={{
                            display: "flex",
                            flexFlow: "column wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "20px",
                            marginTop: "40px"
                        }}>
                            <div>
                                <label htmlFor="paintColor">Paint Color:</label>
                                <input type="color" id="paintColor" value={paintColor} onChange={e => updatePaintColor(e.target.value)} />
                            </div>
                            <div style={{
                                display: "flex",
                                flexFlow: "row wrap",
                                padding: "0",
                                width: PIXEL_SIDE_LENGTH*GRID_WIDTH+"px",
                                height: PIXEL_SIDE_LENGTH*GRID_HEIGHT+"px",
                                // marginLeft: "auto",
                                // marginRight: "auto",
                            }}>
                                {gridStatus.map((i, n) => <Pixel coordinate={n} key={n} />)}
                        </div>
                        </div>
                    </div>
                }
            </>
        );
}