using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Room
    {
        public List<Rectangle> Collisions { get; set; }
        public string Image { get; set; }
        public List<Terrain> TerrainObjects { get; set; }
        public List<Monster> monsters { get; set; }
        public int Id { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public Room()
        {

        }

        public Room(int width, int height, string image, List<Terrain> terrainObjects)
        {
            this.Width = width;
            this.Height = height;
            this.Image = image;
            this.TerrainObjects = terrainObjects;
        }
    }
}