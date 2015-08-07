using massey_effect_matthews_mages.DataAL;
using massey_effect_matthews_mages.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace massey_effect_matthews_mages.Controllers
{
    public class GameController : Controller
    {
        static IDAL dal = new DBDataAL();

        public ActionResult GenerateRoom()
        {
            Room[] possibleRooms = new Room[1];

            #region forestRoom

            List<Terrain> terrainObjects = new List<Terrain>();
            terrainObjects.Add(new Terrain(586, 626, 709, 801, @"/content/GameContent/Images/trees01.png"));
            terrainObjects.Add(new Terrain(2268, 1868, 903, 597, @"/content/GameContent/Images/trees02.png"));
            terrainObjects.Add(new Terrain(1884, 216, 709, 801, @"/content/GameContent/Images/trees01.png"));
            terrainObjects.Add(new Terrain(608, 2096, 406, 332, @"/content/GameContent/Images/rock01.png"));

            Room forestRoom = new Room(3200, 3200, @"/content/GameContent/Images/map3_v3.jpg", terrainObjects);

            #endregion



            User u = dal.GetUser(User.Identity.Name);
            u.CurrentHealth = 100;
            //u.MonstersKilled = 10;
            //u.RoomsTraveled = 10;
            dal.UpdateUser(u);







            possibleRooms[0] = forestRoom;
            //Room room = new Room() {Height = 3200, Width = 3200 };
            possibleRooms[0].monsters = GenerateMonsters(possibleRooms[0]);
            return Json(possibleRooms[0], JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUser()
        {
            User u = dal.GetUser(User.Identity.Name);
            string output = JsonConvert.SerializeObject(u);
            return Json(u, JsonRequestBehavior.AllowGet);
        }

        private List<Monster> GenerateMonsters(Room room2)
        {            
            User user = dal.GetUser(User.Identity.Name);

            Random rand = new Random();

            int maxMonsters = rand.Next((user.GetComputedLevel() * 2) - (user.GetComputedLevel() / 2), (user.GetComputedLevel() * 2));

            Monster[] monsters = new Monster[maxMonsters];

            for (int i = 0; i < maxMonsters; i++)
            {
                monsters[i] = new Monster(user.GetComputedLevel(), room2, rand);
            }

            return monsters.ToList();
        }

        public void UpdateRoomTraveledAndMonstersKilled(List<string> list) 
        {
            User user = dal.GetUser(User.Identity.Name);
            user.MonstersKilled += int.Parse(list[0]);
            user.RoomsTraveled += int.Parse(list[1]);
            dal.UpdateUser(user);
        }

        private void UpdateUser(List<string> list)
        {
            User user = dal.GetUser(User.Identity.Name);
            user.Attack += int.Parse(list[0]);
            user.Defense += int.Parse(list[1]);
            dal.UpdateUser(user);
        }

        public ActionResult TestGame()
        {
            return View("Game");
        }
    }
}