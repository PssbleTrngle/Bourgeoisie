package com.possible_triangle.forge;

import com.possible_triangle.Bourgeoisie;
import me.shedaniel.architectury.platform.forge.EventBuses;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;

@Mod(Bourgeoisie.MOD_ID)
public class BourgeoisieForge {
    public BourgeoisieForge() {
        EventBuses.registerModEventBus(Bourgeoisie.MOD_ID, FMLJavaModLoadingContext.get().getModEventBus());
        Bourgeoisie.init();
    }
}
