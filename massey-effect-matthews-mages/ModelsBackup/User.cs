using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Userb
    {
        public string UserName { get; set; }
        public Item[] EquippedItems { get; set; }
        public Item[] Inventory { get; set; }
        public int CurrentHealth { get; set; }
        public int MonstersKilled { get; set; }
        public int RoomsTraveled { get; set; }

        public int CalculateHealth()
        {
            int totalHealth = 0;
            foreach (Item item in EquippedItems)
            {
                totalHealth += item.Health;
            }
            return totalHealth;
        }

        public int CalculateAttack()
        {
            int totalAttack = 0;
            {
                foreach (Item item in EquippedItems)
                {
                    totalAttack += item.Attack;
                }
            }
            return totalAttack;
        }

        public int CalculateSpeed()
        {
            int totalSpeed = 0;
            foreach (Item item in EquippedItems)
            {
                totalSpeed += item.MoveSpeed;
            }
            return totalSpeed;
        }

        public int CalculateRange()
        {
            int range = 0;
            foreach (Item item in EquippedItems)
            {
                range += item.Range;
            }
            return range;
        }
    }
}