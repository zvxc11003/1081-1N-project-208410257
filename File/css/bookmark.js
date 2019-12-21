
//-------------------------------------------------------------------------------

// global variable.
var gNodeList = new Array;
var gCurrImageObj = null;
var gnTOP_POS = 16;
var gnTop = gnTOP_POS;
var gnHiddenTop = gnTOP_POS;
var gsName = "bookmark";
var gBrowser = 0;
var IE = 1;	// Internet Explorer 4+
var NN = 2; // Netscape 4.x
var N6 = 3;	// Netscape 6.x

var gsTarget = "_blank";

var gBlankImg = new Image;
var gVertLineImg = new Image;
var gNodeImg = new Image;
var gLastNodeImg = new Image;

var gCloseFileImg = new Array;
var gOpenFileImg = new Array;
var gFileImg = new Array;

gCloseFileImg[0] = new Image;
gCloseFileImg[1] = new Image;
gOpenFileImg[0] = new Image;
gOpenFileImg[1] = new Image;
gFileImg[0] = new Image;
gFileImg[1] = new Image;


//-------------------------------------------------------------------------------

function list(sTitle, nDstPage, sURL, nID)
{
   this.sTitle = sTitle;
   this.nDstPage = nDstPage;
   this.bExpanded = false;
   this.bShow = false;
   this.parent = null;
   this.children = new Array;
   this.objectID = null;
   this.imageID = null;

   if(nID)
   {
      this.sURL = sURL;
      this.nID = nID;
   }
   else
   {
      // this is for older Magellan generated HTML.
      this.sURL = null;
      this.nID = sURL;
   }
}

//-------------------------------------------------------------------------------

function appendList(parentNode, childNode)
{
   childNode.parent = parentNode;
   parentNode.children[parentNode.children.length] = childNode;

   return childNode;
}

//-------------------------------------------------------------------------------
// this is a recursive function.

function displayList(nodeList, nDepth)
{
   var i, j, k;
   var parentNode, grandParentNode;

   for(i = 0; i < nodeList.length; i++)
   {
      if(gBrowser == IE || gBrowser == N6 )
      {
         if(nodeList[i].children.length > 0)
            document.write('<span id="node' + nodeList[i].nID + '" style="display:');
         else
            document.write('<span id="child' + nodeList[i].nID + '" style="display:');

         if(nodeList[i].parent != null)
            document.write('none">\n');
         else
            document.write('block">\n');
      }
      else if(gBrowser == NN)
      {
         if(nodeList[i].parent == null)
         {
            nodeList[i].bShow = true;

            if(i == 0 && nodeList[i].parent != null)
               gnTop = gnTop + nodeList[i].parent.objectID.clip.height;
            else if(i > 0)
               gnTop = gnTop + nodeList[i - 1].objectID.clip.height;
         }
         else
            nodeList[i].bShow = false;

         if(i == 0 && nodeList[i].parent != null)
            gnHiddenTop = gnHiddenTop + nodeList[i].parent.objectID.clip.height;
         else if(i > 0)
            gnHiddenTop = gnHiddenTop + nodeList[i - 1].objectID.clip.height;

         if(nodeList[i].children.length > 0)
            document.write('<layer id="node');
         else
            document.write('<layer id="child');

         if(nodeList[i].parent != null)
            document.write(nodeList[i].nID + '" top=' + gnHiddenTop + ' visibility="hide">\n');
         else
            document.write(nodeList[i].nID + '" top=' + gnTop + ' visibility="show">\n');
      }


      document.write('<table border=0 cellspacing=0 cellpadding=0>\n<tr>\n');
      document.write('<td valign="middle" nowrap>');

      for(j = nDepth - 1; j > 0; j--)
      {
         parentNode = nodeList[i];
         for(k = j; k > 0; k--)
            parentNode = parentNode.parent;

         grandParentNode = parentNode.parent;

         if(grandParentNode.children[grandParentNode.children.length - 1] == parentNode)
            document.write('<img src="' + gBlankImg.src + '" border=0>');
         else
            document.write('<img src="' + gVertLineImg.src + '" border=0>');
      }

      if(nDepth > 0)
      {
         if((i + 1) == nodeList.length)
            document.write('<img src="' + gLastNodeImg.src + '" border=0>');
         else
            document.write('<img src="' + gNodeImg.src + '" border=0>');
      }

      if(nodeList[i].children.length > 0)
      {
         document.write('<a href="#" onClick="JavaScript:openNode(' + nodeList[i].nID + '); parent.main.focus();return false">');
         document.write('<img src="' + gCloseFileImg[0].src + '" border=0 name="image' + nodeList[i].nID + '" ID="image' + nodeList[i].nID + '">');
		 document.write('</a>');
      }
      else
         document.write('<img src="' + gFileImg[0].src + '" border=0 name="image' + nodeList[i].nID + '">');

      document.write('</td><td valign="middle" nowrap>');

      if(nodeList[i].nDstPage > -2)
         document.write('<a href="#" onClick="JavaScript:openPage(' + nodeList[i].nDstPage + ', document.images.image' + nodeList[i].nID + ');parent.main.focus(); return false">');
      else
         document.write('<a href="' + nodeList[i].sURL + '" target=' + gsTarget + '>');

      document.write('<font size=2 color="blue" face="Helvetica">' + nodeList[i].sTitle + '</font>');
      document.write('</a>');
      document.write('</td>');
      document.write('</tr>\n</table>\n');

      if(gBrowser == IE)
      {
         document.write('</span>\n');

         if(nodeList[i].children.length > 0)
            nodeList[i].objectID = document.all["node" + nodeList[i].nID]; 
         else
            nodeList[i].objectID = document.all["child" + nodeList[i].nID]; 

         nodeList[i].imageID = document.all["image" + nodeList[i].nID]; 
      }
      else if(gBrowser == NN)
      {
         document.write('</layer>\n');

         if(nodeList[i].children.length > 0)
            nodeList[i].objectID = document.layers["node" + nodeList[i].nID]; 
         else
            nodeList[i].objectID = document.layers["child" + nodeList[i].nID]; 

         nodeList[i].imageID = nodeList[i].objectID.document.images[nodeList[i].objectID.document.images.length-1]; 
      }else if( gBrowser == N6)
	  {
	     document.write('</span>\n');

         if(nodeList[i].children.length > 0)
            nodeList[i].objectID = document.getElementById("node" + nodeList[i].nID); 
         else
            nodeList[i].objectID = document.getElementById("child" + nodeList[i].nID); 

         nodeList[i].imageID = document.getElementById("image" + nodeList[i].nID); 

	  }

      if(nodeList[i].children.length > 0)
         displayList(nodeList[i].children, nDepth + 1);
   }
}

//-------------------------------------------------------------------------------

function openPage(nPageNum, imageObj)
{
   if(nPageNum > 0)
   {
      changeSelectedIcon(imageObj);
      parent.nav.openPage2(nPageNum);
parent.main.focus();
   }
   else
      alert("This link has no destination.");
}

//-------------------------------------------------------------------------------

function openNode(nID)
{
   var node = searchNode(gNodeList, nID);
   if(node == null)
      return;

   if(node.bExpanded == false)
   {
      node.bExpanded = true;
      expandNode(node.children)
   }
   else
   {
      node.bExpanded = false;
      shrinkNode(node.children)
   }

   changeExpandIcon(node.imageID, node.bExpanded);

   if(gBrowser == NN)
   {
      gnTop = gnTOP_POS;
      adjustListPos(gNodeList);
   }
}

//-------------------------------------------------------------------------------

function expandNode(node)
{
   var i;

   for(i = 0; i < node.length; i++)
   {
      if(gBrowser == IE || gBrowser == N6 )
      {
         if(node[i].objectID.style.display == "none")
            if(node[i].parent == null || node[i].parent.bExpanded == true)
               node[i].objectID.style.display = "block";
      }
      else if(gBrowser == NN)
      {
         if(node[i].bShow == false)
            if(node[i].parent != null && node[i].parent.bExpanded == true)
               node[i].bShow = true;
      }

      if(node[i].children.length > 0 && node[i].bExpanded == true)
         expandNode(node[i].children);
   }
}

//-------------------------------------------------------------------------------

function shrinkNode(node)
{
   var i;

   for(i = 0; i < node.length; i++)
   {
      if(gBrowser == IE || gBrowser == N6 )
      {
         if(node[i].objectID.style.display == "block")
            node[i].objectID.style.display = "none";
      }
      else if(gBrowser == NN)
      {
         if(node[i].bShow == true)
            node[i].bShow = false;
      }

      if(node[i].children.length > 0)
         shrinkNode(node[i].children);
   }
}

//-------------------------------------------------------------------------------

function updateTree(nPageNum)
{
   var node = ProcessOpenedNode(gNodeList, nPageNum);

   if(gBrowser == NN)
   {
      gnTop = gnTOP_POS;
      adjustListPos(gNodeList);
   }
}

//-------------------------------------------------------------------------------
// this is a recursive function.

function ProcessOpenedNode(nodeList, nPageNum)
{
   var i, k;
   var node;

   for(i = 0; i < nodeList.length; i++)
   {
      if(nodeList[i].nDstPage == nPageNum)
      {
         if(nodeList[i].children.length > 0)
         {
            node = ProcessOpenedNode(nodeList[i].children, nPageNum);

            if(node != null)
            {
               nodeList[i].bExpanded = true; // expand parent.
               changeExpandIcon(nodeList[i].imageID, nodeList[i].bExpanded);

               for(k = 0; k < nodeList.length; k++)
               {
                  if(gBrowser == IE || gBrowser == N6)
                  {
                     if(nodeList[k].objectID.style.display == "none")
                        nodeList[k].objectID.style.display = "block";
                  }
                  else if(gBrowser == NN)
                  {
                     if(nodeList[k].bShow == false)
                        nodeList[k].bShow = true;
                  }
               }
               changeSelectedIcon(node.imageID);

               return node;
            }
         }

         for(k = 0; k < nodeList.length; k++)
         {
            if(gBrowser == IE || gBrowser == N6)
            {
               if(nodeList[k].objectID.style.display == "none")
                  nodeList[k].objectID.style.display = "block";
            }
            else if(gBrowser == NN)
            {
               if(nodeList[k].bShow == false)
                  nodeList[k].bShow = true;
            }
         }
         changeSelectedIcon(nodeList[i].imageID);

         return nodeList[i];
      }
      else if(nodeList[i].children.length > 0)
      {
         node = ProcessOpenedNode(nodeList[i].children, nPageNum);

         if(node != null)
         {
            nodeList[i].bExpanded = true; // expand parent.
            changeExpandIcon(nodeList[i].imageID, nodeList[i].bExpanded);

            for(k = 0; k < nodeList.length; k++)
            {
               if(gBrowser == IE || gBrowser == N6)
               {
                  if(nodeList[k].objectID.style.display == "none")
                     nodeList[k].objectID.style.display = "block";
               }
               else if(gBrowser == NN)
               {
                  if(nodeList[k].bShow == false)
                     nodeList[k].bShow = true;
               }
            }
            changeSelectedIcon(node.imageID);

            return node;
         }
      }
   }

   return null;
}

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

function adjustListPos(nodeList)
{
   var i;
 
   for(i = 0; i < nodeList.length; i++)
   {
      if(nodeList[i].bShow == true)
      {
         if(i == 0 && nodeList[i].parent != null)
            gnTop = gnTop + nodeList[i].parent.objectID.clip.height;
         else if(i > 0)
            gnTop = gnTop + nodeList[i - 1].objectID.clip.height;

         nodeList[i].objectID.moveTo(nodeList[i].objectID.left, gnTop)
         nodeList[i].objectID.visibility = "show";
      }
      else
         nodeList[i].objectID.visibility = "hide";

      if(nodeList[i].children.length > 0)
         adjustListPos(nodeList[i].children);
   }
}

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------

function changeExpandIcon(imageObj, bExpand)
{
   if(imageObj == null)
      return;

   if(bExpand == true)
   {
      if(imageObj.src == gCloseFileImg[1].src)
         imageObj.src = gOpenFileImg[1].src;
      else
         imageObj.src = gOpenFileImg[0].src;
   }
   else
   {
      if(imageObj.src == gOpenFileImg[1].src)
         imageObj.src = gCloseFileImg[1].src;
      else
         imageObj.src = gCloseFileImg[0].src;
   }
}

//-------------------------------------------------------------------------------

function changeSelectedIcon(imageObj)
{
	// for Netscape 6 : 
	// initial variables: 
	if(gBrowser == N6) // netscape 6 do not use relative path for image.src
   	{  var strCloseFile0Src = gCloseFileImg[0].src;
  	   strCloseFile0Src = strCloseFile0Src.substring(2, strCloseFile0Src.length);	// strip off leading dots: ../img/
	   var strCloseFile1Src = gCloseFileImg[1].src;
  	   strCloseFile1Src = strCloseFile1Src.substring(2, strCloseFile1Src.length);

   	   var strOpenFile0Src = gOpenFileImg[0].src;
   	   strOpenFile0Src = strOpenFile0Src.substring(2, strOpenFile0Src.length);
   	   var strOpenFile1Src = gOpenFileImg[1].src;
   	   strOpenFile1Src = strOpenFile1Src.substring(2, strOpenFile1Src.length);

   	   var strFile0Src = gFileImg[0].src;
	    strFile0Src = strFile0Src.substring(2, strFile0Src.length);
   	   var strFile1Src = gFileImg[1].src;
	   strFile1Src = strFile1Src.substring(2, strFile1Src.length);
	}


   if(imageObj != null)
   {
		if(gBrowser == N6) // netscape 6 do not use relative path for image.src
		{    	// comparing: 
			if(imageObj.src.indexOf(strCloseFile0Src) != -1)
				imageObj.src = gCloseFileImg[1].src;
			else if( imageObj.src.indexOf(strOpenFile0Src) != -1 )
				imageObj.src = gOpenFileImg[1].src;
			else if( imageObj.src.indexOf(strFile0Src) != -1)
			   imageObj.src = gFileImg[1].src;    
		}
		else // IE & NN
		{
		  if(imageObj.src == gCloseFileImg[0].src)
			 imageObj.src = gCloseFileImg[1].src;
		  else if(imageObj.src == gOpenFileImg[0].src)
			 imageObj.src = gOpenFileImg[1].src;
		  else if(imageObj.src == gFileImg[0].src)
			 imageObj.src = gFileImg[1].src;
		}
   }

   if(gCurrImageObj != null && gCurrImageObj != imageObj)
   {
	   if(gBrowser == N6) 
  		{
			if(gCurrImageObj.src.indexOf(strCloseFile1Src) != -1)
          		gCurrImageObj.src = gCloseFileImg[0].src;
			else if( gCurrImageObj.src.indexOf(strOpenFile1Src) != -1 )
				gCurrImageObj.src = gOpenFileImg[0].src;
			else if( gCurrImageObj.src.indexOf(strFile1Src) != -1)
      		    gCurrImageObj.src = gFileImg[0].src;
      	}else 
		{
			if(gCurrImageObj.src == gCloseFileImg[1].src)
				gCurrImageObj.src = gCloseFileImg[0].src;
			else if(gCurrImageObj.src == gOpenFileImg[1].src)
				gCurrImageObj.src = gOpenFileImg[0].src;
			else if(gCurrImageObj.src == gFileImg[1].src)
				gCurrImageObj.src = gFileImg[0].src;
		}
   }

   gCurrImageObj = imageObj;
}

//-------------------------------------------------------------------------------
// this is a recursive function.

function searchNode(nodeList, nID)
{
   var node;
   var i;
 
   for(i = 0; i < nodeList.length; i++)
   {
      if(nodeList[i].nID == nID)
         return nodeList[i];
      else if(nodeList[i].children.length > 0)
      {
         node = searchNode(nodeList[i].children, nID);
         if(node != null)
            return node;
      }
   }

   return null;
}

//-------------------------------------------------------------------------------

function initialize()
{

//this one will make bookmark doesn't work in NS6
//   if(document.all)
//      gBrowser = IE;
//      else if(document.layers)
//   gBrowser = NN;
//else
//   return;

	if (navigator.appName == "Microsoft Internet Explorer")
		  gBrowser = IE;
	else if (document.getElementById&&!document.all)	// netscape 6.0
		  gBrowser = N6; 
	else if (navigator.appName == "Netscape")
		  gBrowser = NN;
	else 
		  return;

   // display list.
   displayList(gNodeList, 0, 0);
   // create dummy layer on the bottom so NN will have correct scrolling height.
   if(gBrowser == NN)
      document.write('<layer id="dummy" top=' + gnHiddenTop  + ' visibility="hide">\n');
   // select first item on the list.
   if(gNodeList.length > 0)
      parent.nav.updateContents(parent.nav.gCurrPage);
	
	parent.main.focus();
}

//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
