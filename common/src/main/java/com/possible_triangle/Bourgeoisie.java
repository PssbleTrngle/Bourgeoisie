package com.possible_triangle;

import com.possible_triangle.command.BourgeoisieCommand;
import me.shedaniel.architectury.event.events.CommandRegistrationEvent;
import me.shedaniel.architectury.registry.Registries;
import net.minecraft.core.Registry;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.util.LazyLoadedValue;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;

public class Bourgeoisie {
    public static final String MOD_ID = "bourgeoisie";
    public static final LazyLoadedValue<Registries> REGISTRIES = new LazyLoadedValue<>(() -> Registries.get(MOD_ID));

    public static void init() {
        REGISTRIES.get().get(Registry.ITEM_REGISTRY).register(new ResourceLocation(MOD_ID, "briefcase"), () ->
                new Item(new Item.Properties())
        );

        CommandRegistrationEvent.EVENT.register(BourgeoisieCommand::register);
    }
}
