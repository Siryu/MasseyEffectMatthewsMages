using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace massey_effect_matthews_mages
{
	public class RouteConfig
	{
		public static void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

			routes.MapRoute(
				name: "LogIn",
				url: "Log",
				defaults: new { controller = "Membership", action = "Login" }
			);

			routes.MapRoute(
				name: "Leaderboards",
				url: "Leds",
				defaults: new { controller = "Web", action = "Leaderboard" }
			);

			routes.MapRoute(
				name: "Profile",
				url: "Profile",
				defaults: new { controller = "Web", action = "Profile" }
			);

			routes.MapRoute(
				name: "Home",
				url: "Index",
				defaults: new { controller = "Web", action = "Index" }
			);

			routes.MapRoute(
				name: "Game",
				url: "Game",
				defaults: new { controller = "Game", action = "TestGame" }
			);

			routes.MapRoute(
				name: "GameControllerJson",
				url: "Game/{action}/{id}",
				defaults: new { controller = "Game", id = UrlParameter.Optional }
			);

			routes.MapRoute(
				name: "Default",
				url: "{controller}/{action}/{id}",
				defaults: new { controller = "Web", action = "Index", id = UrlParameter.Optional }
			);
		}
	}
}
