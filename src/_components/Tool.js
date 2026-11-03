"use client"
import { useState, useEffect } from "react";

export default function Tool() {
    const GRID_WIDTH = 20;
    const GRID_HEIGHT = 10;
    const PIXEL_SIDE_LENGTH = 20;
    const [gridStatus, updateGridStatus] = useState(Array(GRID_WIDTH*GRID_HEIGHT).fill("white"));
    const [paintColor, updatePaintColor] = useState("black");
    const [isMouseDown, updateIsMouseDown] = useState(false);

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
            <div style={{
                width: "100vw",
                height: "100vh",
                position: "fixed",
                left: "0",
                top: "0",
                zIndex: "1",
                paddingTop: ""
            }} onMouseUp={() => updateIsMouseDown(false)}>
                <h1>Parxel: Pixel Art Creator</h1>
                <div style={{
                    display: "flex",
                    flexFlow: "row wrap",
                    padding: "0",
                    width: PIXEL_SIDE_LENGTH*GRID_WIDTH+"px",
                    height: PIXEL_SIDE_LENGTH*GRID_HEIGHT+"px",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                    {gridStatus.map((i, n) => <Pixel coordinate={n} key={n} />)}
                </div>
            </div>
        </>
    );
}