@Entity
@Table(name = "glucose_entries")
@Data
public class GlucoseEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Float value;
    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "glucose_range_id")
    private GlucoseRange glucoseRange;
}
