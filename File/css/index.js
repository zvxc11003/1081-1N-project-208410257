//-------------------------------------------------------------------------------

// global variables
var gIconImg;
var gFirstPage;
var gLastPage;
var gsName = "index";

var gsPgName = "Page";
var gnPageStyle = 0;

gIconImg = new Array;
gIconImg[0] = new Image;
gIconImg[1] = new Image;

// NOTE: DO NOT ERASE TWO LINES OF COMMENTED OUT CODE.
// REMOVING THEM CAN CAUSE SCRIPT ERROR IN CERTAIN BUILD OF IE5.
// gIconImg[0].src = "12345";
// gIconImg[1].src = "12345";

//-------------------------------------------------------------------------------

function setIcon(pageNum, iconNum)
{
   if(pageNum >= gFirstPage && pageNum <= gLastPage)
      document.images[pageNum - gFirstPage].src = gIconImg[iconNum].src;
}

//-------------------------------------------------------------------------------

function initialize()
{
   var i;

   document.writeln('<center>\n<p>');
   document.writeln('<table border=0>');

   for(i = gFirstPage; i <= gLastPage; i++)
   {
      document.writeln('<tr><td nowrap>');
      document.writeln('   <img src="' + gIconImg[0].src + '" border=0>');
      document.writeln('   <a href="#" onClick="JavaScript:parent.nav.openPage(' + i + '); parent.main.focus();return false">');
      document.write('   <font size=2 face="Verdana, Helvetica"><b> ');

      if(gnPageStyle != 0)
         document.writeln(i + ' ' + gsPgName + '</b></font></a>');
      else
         document.writeln(gsPgName + ' ' + i + '</b></font></a>');

      document.writeln('</td></tr>');
   }

   document.writeln('</table>\n</center>');

   setIcon(parent.nav.gCurrPage, 1);
}

//-------------------------------------------------------------------------------
