using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace massey_effect_matthews_mages.Models.Identity
{
	public class LogUserSignInManager : SignInManager<LogUser, int>
	{
		public LogUserSignInManager(LogUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(LogUser user)
        {
            return user.GenerateUserIdentityAsync((LogUserManager)UserManager);
        }

        public static LogUserSignInManager Create(IdentityFactoryOptions<LogUserSignInManager> options, IOwinContext context)
        {
            return new LogUserSignInManager(context.GetUserManager<LogUserManager>(), context.Authentication);
        }
	}
}