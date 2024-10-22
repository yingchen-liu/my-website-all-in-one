package com.yingchenliu.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.transaction.annotation.EnableTransactionManagement
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@SpringBootApplication
@EnableNeo4jRepositories
@EnableTransactionManagement
class MyWebsiteApplication

fun main(args: Array<String>) {
	runApplication<MyWebsiteApplication>(*args)
}

@Configuration
class WebServerConfiguration {

	@Value("\${cors.originPatterns:default}")
	private val corsOriginPatterns: String = ""

	@Bean
	fun addCorsConfig(): WebMvcConfigurer {
		return object : WebMvcConfigurer {
			override fun addCorsMappings(registry: CorsRegistry) {
				val allowedOrigins = corsOriginPatterns.split(",").toTypedArray()
				registry.addMapping("/**")
					.allowedMethods("*")
					.allowedOriginPatterns(*allowedOrigins)
					.allowCredentials(true)
			}
		}
	}
}

@Configuration
@EnableWebSocketMessageBroker
class WebSocketConfig : WebSocketMessageBrokerConfigurer {
	override fun registerStompEndpoints(registry: StompEndpointRegistry) {
		registry.addEndpoint("/ws")
			.setAllowedOrigins("http://localhost:3000", "http://localhost:5173", "https://yingchenliu.com", "https://websocketking.com/")
	}

	override fun configureMessageBroker(config: MessageBrokerRegistry) {
		config.setApplicationDestinationPrefixes("/app")
		config.enableSimpleBroker("/topic")  // Topic for sending messages
	}
}