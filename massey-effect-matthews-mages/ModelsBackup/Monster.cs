using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Monster
    {
        public string Name { get; set; }
        public int MaxHealth { get; set; }
        public int Attack { get; set; }
        public Item DropItem { get; set; }
        public int MoveSpeed { get; set; }
        public Position StartPosition { get; set; }

        public Monster()
        {

        }

        public Monster(int characterLevel, Room room, Random rand)
        {
            Name = "Scary Monster";
            MaxHealth = characterLevel / 3;
            Attack = characterLevel / 3;
            MoveSpeed = 300;
            
            StartPosition = new Position(rand.Next(room.Width), rand.Next(room.Height));
        }
    }
}