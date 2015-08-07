using massey_effect_matthews_mages.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Itemb
    {
        public string Name { get; set; }
        public int Attack { get; set; }
        public int Health { get; set; }
        public int MoveSpeed { get; set; }
        public int Range { get; set; }
        public ItemType Type { get; set; }
    }
}