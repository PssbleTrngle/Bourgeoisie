package com.possible_triangle.fabric;

import com.possible_triangle.Bourgeoisie;
import net.fabricmc.api.ModInitializer;

@SuppressWarnings("unused")
public class BourgeoisieFabric implements ModInitializer {
    @Override
    public void onInitialize() {
        Bourgeoisie.init();
    }
}
