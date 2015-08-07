using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Monster
    {
        public static int DropChancePercentage = 50;
        public string Name { get; set; }
        public int MaxHealth { get; set; }
        public int Attack { get; set; }
        public Item DropItem { get; set; }
        public int MoveSpeed { get; set; }
        public Position StartPosition { get; set; }

        public string Image { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public int CollisionX { get; set; }
        public int CollisionY { get; set; }
        public int CollisionHeight { get; set; }
        public int CollisionWidth { get; set; }

        public Monster()
        {

        }

        public Monster(int characterLevel, Room room, Random rand)
        {
            Name = "Scary Monster";
            MaxHealth = characterLevel / 3;
            Attack = characterLevel / 3;
            MoveSpeed = 300;
            DropItem = GetDropItem(rand);

            Image = @"/Content/GameContent/Images/monster_small.png";
            Width = 250;
            Height = 172;
            CollisionWidth = 188;
            CollisionHeight = 52;
            CollisionX = 62;
            CollisionY = 120;

            StartPosition = new Position(rand.Next(room.Width), rand.Next(room.Height));
        }

        private Item GetDropItem(Random rand)
        {
            Item item = null;
            if (DropChancePercentage / rand.Next(1,100) >= 1 )
            {
                item = new Item();
                if (rand.Next(2) % 2 == 1)
                {
                    item.Attack = rand.Next(1, 3);
                }
                else
                {
                    item.Defense = rand.Next(1, 3);
                }
            }
            return item;
        }
    }
}