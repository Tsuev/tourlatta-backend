import Route from "./Route.js";
import Guide from "./Guide.js";
import Admin from "./Admin.js";


Route.belongsToMany(Guide, { through: 'guide_route', foreignKey: 'routeId' });
Guide.belongsToMany(Route, { through: 'guide_route', foreignKey: 'guideId' });

export {Route, Guide, Admin}