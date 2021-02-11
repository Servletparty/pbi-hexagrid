/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

import { VisualSettings } from "./settings";
import * as BABYLON from "@babylonjs/core";
import * as HexaGrid from "./HexaGrid";

export class Visual implements IVisual {
    private _canvas: HTMLCanvasElement;
    private _settings: VisualSettings;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _skybox: BABYLON.Mesh;
    private _hexaGrid: HexaGrid.HexaGrid;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        //this.target = options.element;
        if (document) {
            this._canvas = document.createElement("canvas");
            this._canvas.setAttribute("id", "renderCanvas");
            options.element.append(this._canvas);
            this._engine = new BABYLON.Engine(this._canvas, true);
            this._scene =  new BABYLON.Scene(this._engine);

            this._hexaGrid = new HexaGrid.HexaGrid(this._scene);
        }
    }

    public update(options: VisualUpdateOptions) {
        this._settings = Visual.parseSettings(options && options.dataViews && options.dataViews[0]);
        let width: number = options.viewport.width;
        let height: number = options.viewport.height;
        this._canvas.setAttribute("width", width.toString());
        this._canvas.setAttribute("height", height.toString());
        this._hexaGrid.DoRender(this._canvas, this._engine, this._scene);
    }

    public createSkybox(scene: BABYLON.Scene) {
        let sMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyboxMaterial", scene);
        sMaterial.backFaceCulling = false;
        sMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/skybox", scene);
        sMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        sMaterial.disableLighting = true;
        
        this._skybox = BABYLON.Mesh.CreateBox("skybox", 250, scene);
        this._skybox.material = sMaterial;
    }

    private static parseSettings(dataView: DataView): VisualSettings {
        return <VisualSettings>VisualSettings.parse(dataView);
    }

    /**
     * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
     * objects and properties you want to expose to the users in the property pane.
     *
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
        return VisualSettings.enumerateObjectInstances(this._settings || VisualSettings.getDefault(), options);
    }
}