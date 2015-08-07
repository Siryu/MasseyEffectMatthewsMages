using massey_effect_matthews_mages.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.DataAL
{
    public class DBDataAL : IDAL
    {
        public void UpdateUser(Models.User user)
        {
            using (TempDBContext1 db = new TempDBContext1())
            {
                User oldUser = db.Users.Find(user.UserName);
                oldUser.CurrentHealth = user.CurrentHealth; 
                oldUser.MonstersKilled = user.MonstersKilled;
                oldUser.RoomsTraveled = user.RoomsTraveled;
                oldUser.Attack = user.Attack;
                oldUser.Defense = user.Defense;
                oldUser.AttackSpeed = user.AttackSpeed;
                oldUser.AttackRange = user.AttackRange;
                oldUser.MoveSpeed = user.MoveSpeed;
                db.SaveChanges();
            }
        }

        public void CreateUser(Models.User user)
        {
            using(TempDBContext1 db = new TempDBContext1())
            {
                db.Users.Add(user);
                db.SaveChanges();
            }
        }

        public Models.User GetUser(string userName)
        {
            User foundUser = null;
            using (TempDBContext1 db = new TempDBContext1())
            {
                foundUser = db.Users.Find(userName);
            }
            return foundUser;
        }

        public IEnumerable<Models.User> GetAllUsers()
        {
            IEnumerable<User> users = null;
            using (TempDBContext1 db = new TempDBContext1())
            {
                users = db.Users.ToList();
            }
            return users;
        }

        public IEnumerable<string> GetAllUsernames()
        {
            IEnumerable<User> users = null;
            List<string> names = new List<string>();
            using (TempDBContext1 db = new TempDBContext1())
            {
                users = db.Users.ToList();
            }
            if(users != null && users.Count() > 0)
            {
                foreach (User u in users)
                {
                    names.Add(u.UserName);
                }
            }
            return names;
        }

        public void CreateMessage(Message message)
        {
            using(TempDBFriendContext db = new TempDBFriendContext())
            {
                db.Messages.Add(message);
                db.SaveChanges();
            }
        }

        public void RemoveMessage(Message message)
        {
            using (TempDBFriendContext db = new TempDBFriendContext())
            {
                db.Messages.Remove(message);
                db.SaveChanges();
            }
        }

        public IEnumerable<Message> GetMessagesFor(User user)
        {
            IEnumerable<Message> messages = null;
            using (TempDBFriendContext db = new TempDBFriendContext())
            {
                messages = db.Messages.Where(x => x.Receiver.Equals(user.UserName)).ToList();
            }
            return messages;
        }

        public void CreateFriendRequest(FriendRequest fr)
        {
            using (TempDBFriendContext db = new TempDBFriendContext())
            {
                db.FriendRequests.Add(fr);
                db.SaveChanges();
            }
        }

        public void RemoveFriendRequest(FriendRequest fr)
        {
            using (TempDBFriendContext db = new TempDBFriendContext())
            {
                db.FriendRequests.Add(fr);
                db.SaveChanges();
            }
        }

        public IEnumerable<FriendRequest> GetFriendRequests(User user)
        {
            IEnumerable<FriendRequest> requests = null;
            using (TempDBFriendContext db = new TempDBFriendContext())
            {
                requests = db.FriendRequests.Where(x => x.Receiver.Equals(user.UserName)).ToList();
            }
            return requests;
        }

        public void AddFriend(string user, string newFriend)
        {
            using (TempDBFriendListContext db = new TempDBFriendListContext())
            {
                db.Friends.Add(new Friend() { User = user, Friend1 = newFriend });
                db.SaveChanges();
            }
        }

        public void RemoveFriend(string user, string friend)
        {
            using (TempDBFriendListContext db = new TempDBFriendListContext())
            {
                db.Friends.Remove(new Friend() { User = user, Friend1 = friend });
                db.SaveChanges();
            }
        }

        public IEnumerable<string> GetFriends(User user)
        {
            IEnumerable<string> friends = null;
            using (TempDBFriendListContext db = new TempDBFriendListContext())
            {
                IEnumerable<string> temp = db.Friends.Where(x => x.User.Equals(user.UserName)).Select(x => x.Friend1).ToList();
                IEnumerable<string> temp2 = db.Friends.Where(x => x.Friend1.Equals(user.UserName)).Select(x => x.User).ToList();
                friends = temp.Union(temp2).ToList();
            }
            return friends;
        }
    }
}