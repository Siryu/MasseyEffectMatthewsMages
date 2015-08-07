using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Membership
{
	public class RegisterModel
	{
		[Required(ErrorMessage = "User Name field cannot be blank")]
		[StringLength(60, MinimumLength = 6, ErrorMessage = "User Name field cannot be less than 6 characters or greater than 50 characters")]
		public string RegisterUserName { get; set; }
		[Required(ErrorMessage = "Password field cannot be blank")]
		[StringLength(60, MinimumLength = 6, ErrorMessage = "Password field cannot be less than 6 characters or greater than 50 characters")]
		public string RegisterPassword { get; set; }
		[Required(ErrorMessage = "Confirm Password field cannot be blank")]
		[StringLength(60, MinimumLength = 6, ErrorMessage = "Confirm Password field cannot be less than 6 characters or greater than 50 characters")]
		public string ConfirmPassword { get; set; }
	}
}