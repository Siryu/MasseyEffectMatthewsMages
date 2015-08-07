using massey_effect_matthews_mages.DataAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public partial class User
    {
        static IDAL dal = new DBDataAL();

        public int GetComputedLevel()
        {
            int charLevel = (MonstersKilled / 6) + (RoomsTraveled / 3);
            
            return charLevel;
        }
    }
}