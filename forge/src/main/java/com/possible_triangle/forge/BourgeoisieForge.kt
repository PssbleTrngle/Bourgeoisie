package com.possible_triangle.forge

import com.possible_triangle.Bourgeoisie
import me.shedaniel.architectury.platform.forge.EventBuses
import net.minecraftforge.fml.common.Mod
import thedarkcolour.kotlinforforge.forge.MOD_CONTEXT

@Mod(Bourgeoisie.MOD_ID)
class BourgeoisieForge {
    init {
        EventBuses.registerModEventBus(Bourgeoisie.MOD_ID, MOD_CONTEXT.getKEventBus())
        Bourgeoisie.init()
    }
}