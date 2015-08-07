using massey_effect_matthews_mages.DataAL;
using massey_effect_matthews_mages.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace massey_effect_matthews_mages.Controllers
{
    public class FriendController : Controller
    {
        [HttpPost]
        public ActionResult DeleteMessage(User user, Message message)
        {
            IDAL DAL = new DBDataAL();
            DAL.RemoveMessage(message);

            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }

        [HttpPost]
        public ActionResult SendMessage(Message message)
        {
            IDAL DAL = new DBDataAL();
            message.TimeStamp = BitConverter.GetBytes(DateTime.Now.Ticks);
            DAL.CreateMessage(message);

            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }

        //view friend profile

        [HttpPost]
        public ActionResult RemoveFriend(User user, string friend)
        {
            IDAL DAL = new DBDataAL();
            DAL.RemoveFriend(user.UserName, friend);

            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }

        [HttpPost]
        public ActionResult AcceptFriendRequest(User receiver, string sender)
        {
            IDAL DAL = new DBDataAL();
            DAL.AddFriend(receiver.UserName, sender);

            IEnumerable<FriendRequest> requests = DAL.GetFriendRequests(receiver).Where(r => r.Sender == sender);
            IEnumerable<FriendRequest> requests2 = DAL.GetFriendRequests(DAL.GetUser(sender)).Where(r => r.Sender == receiver.UserName);
            IEnumerable<FriendRequest> fullList = requests.Concat(requests2);
            foreach (FriendRequest req in fullList)
            {
                DAL.RemoveFriendRequest(req);
            }

            IEnumerable<FriendRequest> friends = DAL.GetFriendRequests(receiver);

            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }

        [HttpPost]
        public ActionResult DenyFriendRequest(User receiver, string sender)
        {
            IDAL DAL = new DBDataAL();
            FriendRequest fr = DAL.GetFriendRequests(receiver).Where(r => r.Sender == sender).First();
            DAL.RemoveFriendRequest(fr);

            IEnumerable<FriendRequest> friends = DAL.GetFriendRequests(receiver);

            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }
        
        [HttpGet]
        public ActionResult Search(User user, string name)
        {
            FriendData data = new FriendData("matt");
            data.SearchFor(name);
            return View("Web/Friends", data);
        }

        [HttpPost]
        public ActionResult RequestFriend(User user, string name)
        {
            FriendRequest fr = new FriendRequest();
            fr.Receiver = name;
            fr.Sender = user.UserName;
            IDAL DAL = new DBDataAL();
            DAL.CreateFriendRequest(fr);
            
            FriendData data = new FriendData("matt");
            return View("Web/Friends", data);
        }
    }
}