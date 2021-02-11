import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var babylonTestC33AC33D78DB4689A1764916141363E6_DEBUG: IVisualPlugin = {
    name: 'babylonTestC33AC33D78DB4689A1764916141363E6_DEBUG',
    displayName: 'BabylonTest',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["babylonTestC33AC33D78DB4689A1764916141363E6_DEBUG"] = babylonTestC33AC33D78DB4689A1764916141363E6_DEBUG;
}

export default babylonTestC33AC33D78DB4689A1764916141363E6_DEBUG;