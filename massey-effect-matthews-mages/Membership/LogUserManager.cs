using massey_effect_matthews_mages.Membership;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models.Identity
{
	public class LogUserManager : UserManager<LogUser, int>
	{
		public LogUserManager(IUserStore<LogUser, int> store) 
			: base(store)
		{

		}
		public static LogUserManager Create(IdentityFactoryOptions<LogUserManager> options, IOwinContext context) 
        {
            var manager = new LogUserManager(new LogUserStore(context.Get<ApplicationDbContext>()));

            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
            };

            return manager;
        }
    }
}
