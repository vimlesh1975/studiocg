#-------------------------------------------------------------------------------------------------------------------------------------------------
#
# Module: SceneNodeScripting
# Description: This module contains the scripting operations on the SceneNode
# Author: wTVision R3 Space Engine Team
# Date: September 12, 2023
#
# http://documentation.wtvision.com/r3space/09-Scripting_Guide/#global-scope-objects
#
# Quick Commands Guide: 
#   Help                    Prints the commands available on the console
#   Clear                   Cleans the console and Error List
#   Scope                   Prints the elements available on the module scope including your methods the methods 
#   SceneNode               SceneNode Object represents this Script elemnent
#   RenderEngine            RenderEngine Object
#   RenderDevice            Render 
#   <MethodName>()          Executes the methods
#
# Python Quick Guide:
#   print(<>)               prints to the console the content of the parameter passed
#   help(<>)                returns the help of the object passed as parameter
#   dir(<>)                 returns properties and methods of the object passed as parameter
#   <ObjectName>.__doc__    return 
#-------------------------------------------------------------------------------------------------------------------------------------------------
import time
import sys

#-------------------------------------------------------------------------------------------------------------------------------------------------
#
# Write your algorithm in the here()
# Uncomment the DrawEvent() line on the Draw when you completed your algorithm
# In order to test your code type DrawEvent() on the command textbox on the console bellow
#
#-------------------------------------------------------------------------------------------------------------------------------------------------
def DrawEvent():
    start = time.time()# When we started executing
    #Sample Funcional
    end = time.time()
    print(end - start)# When we ended executing

#-------------------------------------------------------------------------------------------------------------------------------------------------
#
# Used in Scene Node Scripting when script is added as extension
# The UpdateExtension() event occurs on each Pre Draw update
#
#-------------------------------------------------------------------------------------------------------------------------------------------------
def UpdateExtension():
    #DrawEvent()
    pass