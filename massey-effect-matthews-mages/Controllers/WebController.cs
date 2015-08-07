using massey_effect_matthews_mages.DataAL;
using massey_effect_matthews_mages.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace massey_effect_matthews_mages.Controllers
{
    public class WebController : Controller
    {
        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Leaderboard()
        {
            IDAL DAL = new DBDataAL();
            IEnumerable<User> users = DAL.GetAllUsers();
            return View(users);
        }

        [HttpGet]
        public ActionResult Profile()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Play()
        {
            return View();            
        }

        [HttpGet]
        public ActionResult Store()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Crafting()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Messages()
        {
            return View();
        }

        //static pages
        [HttpGet]
        public ActionResult AboutUs()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Help()
        {
            return View();
        }

        //Friend actions
        [HttpGet]
        public ActionResult Friends()
        {
            massey_effect_matthews_mages.Models.FriendData data = new FriendData("matt");
            return View(data);
        }

        [HttpGet]
        public ActionResult TempGame()
        {
            return View();
        }

        public ActionResult LogIn()
        {
            return View();
        }
    }
}