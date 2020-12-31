package com.possible_triangle

import com.mojang.brigadier.CommandDispatcher
import com.possible_triangle.command.BourgeoisieCommand
import com.possible_triangle.item.BriefcaseItem
import me.shedaniel.architectury.event.events.CommandRegistrationEvent
import me.shedaniel.architectury.registry.Registries
import net.minecraft.commands.CommandSourceStack
import net.minecraft.commands.Commands
import net.minecraft.core.Registry
import net.minecraft.resources.ResourceLocation
import net.minecraft.util.LazyLoadedValue
import net.minecraft.world.item.Item

object Bourgeoisie {

    const val MOD_ID = "bourgeoisie"
    private val REGISTRIES = LazyLoadedValue { Registries.get(MOD_ID) }

    fun init() {
        REGISTRIES.get().get(Registry.ITEM_REGISTRY).register(ResourceLocation(MOD_ID, "briefcase")) { BriefcaseItem() }
        CommandRegistrationEvent.EVENT.register(BourgeoisieCommand)
    }
}