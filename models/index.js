import Route from "./Route.js";
import Guide from "./Guide.js";
import Admin from "./Admin.js";


Route.belongsToMany(Guide, { through: 'guide_route', foreignKey: 'routeId', as: 'guides' });
Guide.belongsToMany(Route, { through: 'guide_route', foreignKey: 'guideId', as: 'routes' });

export {Route, Guide, Admin}