using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(massey_effect_matthews_mages.Startup))]
namespace massey_effect_matthews_mages
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
