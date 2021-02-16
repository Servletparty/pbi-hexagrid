import * as BABYLON from "@babylonjs/core";

export class HexaGrid {
    private _width: number = 1;
    private _depth: number = 1;
    private _margin: number = 1;
    private _initialPosition: BABYLON.Vector3;
    private _grid: BABYLON.Mesh;
    private _prefab: BABYLON.Mesh;
    private _camera: BABYLON.ArcRotateCamera;
    private _light: BABYLON.DirectionalLight;

    constructor(scene: BABYLON.Scene, externalResources: string) {
        //this._grid = new BABYLON.Mesh("Grid", scene);
        //this._grid.skeleton
        //this._grid.isVisible = false;
        let materials: BABYLON.StandardMaterial[] = [
            new BABYLON.StandardMaterial("BlueMaterial", scene),
            new BABYLON.StandardMaterial("GreenMaterial", scene),
            new BABYLON.StandardMaterial("BrownMaterial", scene)
        ]

        materials[0].diffuseTexture = new BABYLON.Texture(externalResources + "/tiles/blue.png", scene);
        materials[1].diffuseTexture = new BABYLON.Texture(externalResources + "/tiles/green.png", scene);
        materials[2].diffuseTexture = new BABYLON.Texture(externalResources + "/tiles/brown.png", scene);

        let coordsx: number[] = [0, 2, 3, 5, 6, 10, 12];
        let coordsz: number[] = [0, 1, 2, 12, 14, 6, 3];
        // let ground: BABYLON.Mesh = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
        // ground.position = new BABYLON.Vector3(0, 0, 0);
        // let mat1: BABYLON.StandardMaterial = new BABYLON.StandardMaterial('mat1', scene);
        // mat1.diffuseColor = new BABYLON.Color3(1, 0, 0);
        // ground.material = mat1;

        let random: number = 0;
        coordsx.forEach(x => {
            coordsz.forEach(z => {
                random = Math.floor(Math.random() * 10);
                let height: number = Math.floor(Math.random() * 10);
                let prefab: BABYLON.Mesh = BABYLON.Mesh.CreateCylinder("Cylinder", height, Math.random(), Math.random(), 24, 1, scene, false);
                //let prefab: BABYLON.Mesh = BABYLON.Mesh.CreateCylinder("Cylinder", height, 0.1, 1, 24, 1, scene, false);
                prefab.position = new BABYLON.Vector3(x, height, z);
                if (random % 2 === 0) {
                    //tile.scaling.y += 3;
                    prefab.material = materials[0];
                    //tile.position = this.getWorldCoordinates(x, 0, z);
                }
                else if (random % 3 === 0) {
                    //tile.scaling.y += 6;
                    prefab.material = materials[2];
                    //tile.position = this.getWorldCoordinates(x, 0, z);
                }
                else {
                    //tile.scaling.y += 6;
                    prefab.material = materials[1];
                    //tile.position = this.getWorldCoordinates(x, 0, z);
                }
            });
        });

        //this._prefab = BABYLON.Mesh.CreateCylinder("Cylinder", 1, 3, 3, 6, 1, scene, false);
        //this._prefab = BABYLON.Mesh.CreateCylinder("Cylinder", 2, 0.1, 3, 24, 1, scene, false);
        //this._prefab.position = new BABYLON.Vector3(0, 1, 0);
        //this._prefab.scaling = new BABYLON.Vector3(3, 0.1, 3);
        // this._prefab.rotation.y += Math.PI / 6;
        //let boundingInfo = this._prefab.getBoundingInfo();

        // this._width = (boundingInfo.maximum.z - boundingInfo.minimum.z) * this._prefab.scaling.x;
        // this._depth = (boundingInfo.maximum.x - boundingInfo.minimum.x) * this._prefab.scaling.z;
        // this._initialPosition = this.calculateInitialPosition();

        

        //this._prefab.material = materials[0];
        // let tile: BABYLON.Mesh = null;
        // let random: number = 0;

        // for (var z = 0; z < this._depth; z++) {
        //     for (var x = 0; x < this._width; x++) {
        //         tile = this._prefab.clone();
        //         tile.name = "tile-" + x + "-" + z;
        //         tile.position = this.getWorldCoordinates(x, 0, z);
        //         tile.position = new BABYLON.Vector3(x, 0, z);

        //         random = Math.floor(Math.random() * 10);

        //         if (random % 2 === 0) {
        //             //tile.scaling.y += 3;
        //             tile.material = materials[0];
        //             tile.position = this.getWorldCoordinates(x, 0, z);
        //         }
        //         else if (random % 3 === 0) {
        //             //tile.scaling.y += 6;
        //             tile.material = materials[2];
        //             tile.position = this.getWorldCoordinates(x, 0, z);
        //         }
        //         else {
        //             //tile.scaling.y += 6;
        //             tile.material = materials[1];
        //             tile.position = this.getWorldCoordinates(x, 0, z);
        //         }

        //         tile.parent = this._grid;
        //     }
        // }
        // this._prefab.dispose();
    }

    public DoRender(canvas: HTMLCanvasElement, engine: BABYLON.Engine, scene: BABYLON.Scene): void {
        this._camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 60, new BABYLON.Vector3(0, 0, 0), scene);
        scene.activeCamera = this._camera;
        scene.activeCamera.attachControl(canvas);

        this._light = new BABYLON.DirectionalLight("DirLight", new BABYLON.Vector3(-1, -1, -1), scene);
        this._light.diffuse = new BABYLON.Color3(1, 1, 1);
        this._light.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
        this._light.intensity = 1.5;

        // Run the render loop.
        engine.runRenderLoop(() => {
            scene.render();
        });

        // The canvas/window resize event handler.
        window.addEventListener("resize", () => {
            engine.resize();
        });

        document.body.addEventListener("pointerdown", (event) => {
            this.highLightTile(event, scene);
        });
    }

    private highLightTile(event: any, scene: BABYLON.Scene): void {
        let highlightedTile = null;
        let highlightedMaterial: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("hlMat", scene);
        highlightedMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        highlightedMaterial.alpha = 0.8;

        let pick:BABYLON.PickingInfo = scene.pick(event.clientX, event.clientY);

        if (pick.pickedMesh && pick.pickedMesh !== highlightedTile  && pick.pickedMesh.name != "skybox" ) {
            console.log(pick.pickedMesh.name);
            let pickedMesh: any = pick.pickedMesh;
            if(pickedMesh.oldMaterial){
                let mat: BABYLON.StandardMaterial = pickedMesh.material;
                pickedMesh.material = pickedMesh.oldMaterial
                pickedMesh.oldMaterial = mat;
            }else{    
                pickedMesh.oldMaterial = pickedMesh.material;
                pickedMesh.material = highlightedMaterial;
                highlightedTile = pickedMesh;
            }
        }
    }

    private calculateInitialPosition(): BABYLON.Vector3 {
        let position: BABYLON.Vector3 = BABYLON.Vector3.Zero();
        position.x = -this._width * this._width / 2.0 + this._width / 2.0;
        position.z = this._depth / 2.0 * this._depth / 2.0;
        return position;
    }

    private getWorldCoordinates(x: number, y: number, z: number): BABYLON.Vector3 {
        let offset: number = 0;

        if (z % 2 !== 0) {
            offset = this._width / 2.0;
        }

        var px = this._initialPosition.x + offset + x * this._width * this._margin;
        var pz = this._initialPosition.z - z * this._depth * 0.75 * this._margin;

        return new BABYLON.Vector3(px, y, pz);
    }
}