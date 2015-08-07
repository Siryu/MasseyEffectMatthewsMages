using massey_effect_matthews_mages.DataAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class FriendData
    {
        public User Owner { get; set; }
        public List<Message> Messages { get; set; }
        public List<string> FriendsList { get; set; }
        public List<FriendRequest> ActiveRequests { get; set; }
        public List<string> NotFriends { get; set; }

        public FriendData(User user)
        {
            Owner = user;
            SetUp();
        }

        public FriendData(string name)
        {
            IDAL DAL = new DBDataAL();
            Owner = DAL.GetUser(name);
            SetUp();
        }

        private void SetUp()
        {
            PopulateMessages();
            PopulateFriendsList();
            PopulateActiveRequests();
            PopulateNotFriends();
        }

        private void PopulateMessages()
        {
            IDAL DAL = new DBDataAL();
            Messages = DAL.GetMessagesFor(Owner).ToList();
        }

        private void PopulateFriendsList()
        {
            IDAL DAL = new DBDataAL();
            FriendsList = DAL.GetFriends(Owner).ToList();
        }

        private void PopulateActiveRequests()
        {
            IDAL DAL = new DBDataAL();
            ActiveRequests = DAL.GetFriendRequests(Owner).ToList();
        }
        private void PopulateNotFriends()
        {
            IDAL DAL = new DBDataAL();
            IEnumerable<string> friends = DAL.GetFriends(Owner);
            IEnumerable<string> users = DAL.GetAllUsernames();
            NotFriends = users.Where(x => x != Owner.UserName).Where(x => !friends.Contains(x)).ToList();
        }

        public void SearchFor(string name)
        {
            NotFriends = NotFriends.Where(x => x.Contains(name)).ToList();
        }
    }
}